export type WorkspaceView =
  | "roadmap"
  | "lessons"
  | "atlas"
  | "simulators"
  | "research";

export type DifficultyTier = "Beginner" | "Intermediate" | "University Research";

export type MeasurementCertainty =
  | "Measured"
  | "Model-Estimated"
  | "Uncertain / Debated";

export interface MeasuredQuantity {
  value: string;
  unit?: string;
  numericValue?: number;
  certainty: MeasurementCertainty;
  note: string;
}

export interface StarProfile {
  id: string;
  name: string;
  designation: string;
  constellation: string;
  spectralType: string;
  spectralClassGroup: "O" | "B" | "A" | "F" | "G" | "K" | "M" | "LBV" | "Variable";
  colorHex: string;
  galacticLocation: string;
  distance: MeasuredQuantity;
  classification: string;
  mass: MeasuredQuantity;
  radius: MeasuredQuantity;
  temperature: MeasuredQuantity;
  luminosity: MeasuredQuantity;
  age: MeasuredQuantity;
  evolutionaryStage: string;
  scientificImportance: string;
  unusualCharacteristics: string;
  latestResearch: string;
  hrCoordinates: {
    teffK: number;
    lumSolar: number;
  };
}

export interface StellarTypeEntry {
  id: string;
  name: string;
  spectralOrClass: string;
  colorHex: string;
  formation: string;
  structure: string;
  temperatureRange: string;
  massRange: string;
  luminosityRange: string;
  lifespan: string;
  scientificSignificance: string;
}

export interface EquationEntry {
  title: string;
  latex: string;
  variables: Array<{ symbol: string; meaning: string; units: string }>;
  stepByStep: string[];
}

export interface ModuleSection {
  id: string;
  title: string;
  kicker?: string;
  beginner: string;
  intermediate: string;
  research: string;
  keyTakeaways: string[];
  equations?: EquationEntry[];
  realExample?: {
    title: string;
    detail: string;
  };
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface MathProblem {
  id: string;
  title: string;
  prompt: string;
  given: string[];
  solutionSteps: string[];
  finalAnswer: string;
}

export interface McqQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface OpenPromptQuestion {
  id: string;
  kind: "Conceptual" | "Research-Oriented";
  question: string;
  rubric: string;
  modelAnswer: string;
}

export interface CurriculumModule {
  id: number;
  slug: string;
  roadmapStage:
    | "Beginner astronomy"
    | "Intermediate stellar astronomy"
    | "Advanced stellar astrophysics"
    | "Observational astronomy"
    | "Computational stellar research";
  title: string;
  subtitle: string;
  overview: string;
  learningOutcomes: string[];
  sections: ModuleSection[];
  vocabulary: VocabularyTerm[];
  mathProblems: MathProblem[];
  mcqs: McqQuestion[];
  openQuestions: OpenPromptQuestion[];
  revisionNotes: string[];
}

export interface RoadmapStageInfo {
  id: number;
  title:
    | "Beginner astronomy"
    | "Intermediate stellar astronomy"
    | "Advanced stellar astrophysics"
    | "Observational astronomy"
    | "Computational stellar research";
  summary: string;
  moduleIds: number[];
  coreSkills: string[];
  recommendedFirstModule: number;
}

export interface PythonProject {
  id: string;
  title: string;
  libraries: string[];
  datasetSource: string;
  objective: string;
  astrophysicsConcept: string;
  code: string;
  expectedOutput: string;
}

export interface EvaluationResponse {
  scoreOutOf10: number;
  masteryVerdict: string;
  strengths: string[];
  misconceptionsOrGaps: string[];
  professorFeedback: string;
  recommendedNextTier: DifficultyTier;
  revisionNote: string;
}
