import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "1mb" }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it in the Settings > Secrets panel to enable live research synthesis and assessment grading."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

app.post("/api/research/investigate", async (req, res) => {
  try {
    const { query, focusStar } = req.body as {
      query?: string;
      focusStar?: string;
    };

    if (!query || !query.trim()) {
      res.status(400).json({ error: "A research query is required." });
      return;
    }

    const ai = getGeminiClient();
    const starContext = focusStar
      ? `Focus subject: ${focusStar}. `
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: `${starContext}Investigate the following stellar astrophysics question using authoritative astronomical sources (NASA, ESA, ESO, Chandra, JWST, Gaia DR3, SIMBAD, ApJ, A&A, MNRAS, Nature, Science):

"${query.trim()}"

Structure your response with these exact Markdown headings:
### Confirmed Observations & Measurements
State empirically measured values with uncertainties, instruments/surveys used (e.g., Gaia DR3, VLTI, JWST NIRCam/MIRI, HST, TESS, Chandra), and discovery or publication dates where verified.

### Physical Mechanisms & Theoretical Models
Explain the underlying stellar physics, equations, and evolutionary models cleanly.

### Hypotheses, Conflicting Results & Uncertainties
Explicitly distinguish confirmed measurements from model-dependent estimates, conflicting measurements in peer-reviewed literature, and unresolved systematic uncertainties.

### Open Scientific Questions
Highlight key unanswered questions guiding current observational campaigns.

Do not invent measurements, dates, or citations. If a parameter is uncertain or debated, explicitly state the range and cause of uncertainty.`,
      config: {
        systemInstruction:
          "You are an expert observational astrophysicist and stellar evolution researcher. Prioritize NASA, ESA, ESO, peer-reviewed astronomy journals, and university observatory releases. Never fabricate measurements, uncertainties, or dates.",
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
      },
    });

    const rawChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const seen = new Set<string>();
    const sources: Array<{ title: string; uri: string }> = [];

    for (const chunk of rawChunks) {
      const web = (chunk as { web?: { uri?: string; title?: string } }).web;
      if (web?.uri && !seen.has(web.uri)) {
        seen.add(web.uri);
        sources.push({
          title: web.title || web.uri,
          uri: web.uri,
        });
      }
    }

    res.json({
      synthesis: response.text ?? "",
      sources,
      investigatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to complete research investigation.";
    const status = message.includes("GEMINI_API_KEY") ? 503 : 500;
    res.status(status).json({ error: message });
  }
});

app.post("/api/mentor/evaluate", async (req, res) => {
  try {
    const {
      moduleTitle,
      question,
      rubric,
      userAnswer,
      currentTier,
    } = req.body as {
      moduleTitle?: string;
      question?: string;
      rubric?: string;
      userAnswer?: string;
      currentTier?: string;
    };

    if (!userAnswer || !userAnswer.trim() || !question) {
      res
        .status(400)
        .json({ error: "Both the question and your written answer are required." });
      return;
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: `Module: ${moduleTitle ?? "Stellar Astrophysics"}
Current Learner Tier: ${currentTier ?? "Beginner"}
Question: ${question}
Reference Physics Rubric: ${rubric ?? "Evaluate physical accuracy, conservation laws, units, and mathematical reasoning."}

Student Answer:
"${userAnswer.trim()}"

Evaluate the student's answer rigorously like an astrophysics professor mentoring an aspiring researcher.`,
      config: {
        systemInstruction:
          "You are an astrophysics professor and research mentor. Evaluate student explanations rigorously for physical accuracy, causal mechanisms, equations, and units. Never fabricate observational values. Encourage deeper analytical precision.",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scoreOutOf10: {
              type: Type.INTEGER,
              description: "Integer score from 0 to 10.",
            },
            masteryVerdict: {
              type: Type.STRING,
              description:
                "One of: Needs Review, Developing, Proficient, Research-Ready",
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific physically sound points the student demonstrated.",
            },
            misconceptionsOrGaps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Specific physical misconceptions, missing assumptions, or mathematical omissions.",
            },
            professorFeedback: {
              type: Type.STRING,
              description:
                "Detailed, constructive scientific critique explaining mistakes and next derivation steps.",
            },
            recommendedNextTier: {
              type: Type.STRING,
              description:
                "One of: Beginner, Intermediate, University Research",
            },
            revisionNote: {
              type: Type.STRING,
              description:
                "A crisp 1-2 sentence physics takeaway to lock into revision notes.",
            },
          },
          required: [
            "scoreOutOf10",
            "masteryVerdict",
            "strengths",
            "misconceptionsOrGaps",
            "professorFeedback",
            "recommendedNextTier",
            "revisionNote",
          ],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? "{}").trim());
    res.json(parsed);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to evaluate answer.";
    const status = message.includes("GEMINI_API_KEY") ? 503 : 500;
    res.status(status).json({ error: message });
  }
});

app.post("/api/mentor/ask", async (req, res) => {
  try {
    const { history, message, contextModule } = req.body as {
      history?: Array<{ role: "user" | "model"; text: string }>;
      message?: string;
      contextModule?: string;
    };

    if (!message || !message.trim()) {
      res.status(400).json({ error: "A question is required." });
      return;
    }

    const ai = getGeminiClient();
    const formattedHistory = (history ?? []).slice(-8).map((item) => ({
      role: item.role,
      parts: [{ text: item.text }],
    }));

    const chat = ai.chats.create({
      model: "gemini-4-hydrogen",
      history: formattedHistory,
      config: {
        systemInstruction: `You are an expert stellar astrophysicist, professor, and research mentor.${
          contextModule ? ` The learner is currently studying: ${contextModule}.` : ""
        } Explain physical mechanisms from first principles, provide exact equations (using LaTeX $...$ or $$...$$ notation), distinguish confirmed observations from theoretical models, and suggest observational or Python computational follow-ups when helpful.`,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const response = await chat.sendMessage({ message: message.trim() });
    res.json({ reply: response.text ?? "" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to reach astrophysics mentor.";
    const status = message.includes("GEMINI_API_KEY") ? 503 : 500;
    res.status(status).json({ error: message });
  }
});

async function startServer() {
  const port = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Stellar Observatory server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
