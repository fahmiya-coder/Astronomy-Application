import { PythonProject } from "../types/astrophysics";

export const PYTHON_PROJECTS: PythonProject[] = [
  {
    id: "gaia-hr-isochrone",
    title: "Project 1: Open Cluster Color-Magnitude Diagram & Main-Sequence Turnoff Age (Gaia DR3)",
    libraries: ["numpy", "pandas", "matplotlib", "astropy"],
    datasetSource: "ESA Gaia DR3 Archive (Pleiades M45 & M67 Parallax + G/BP/RP Photometry)",
    objective: "Convert apparent G-band magnitudes and Gaia trigonometric parallaxes into absolute magnitudes M_G, filter astrometric noise, plot the empirical H-R diagram, and estimate cluster turnoff age.",
    astrophysicsConcept: "Distance modulus M_G = G + 5 log10(ϖ_mas) - 10, dereddened BP−RP color index, and main-sequence turnoff luminosity dating.",
    expectedOutput: "Publication-grade inverted-Y Color-Magnitude Diagram separating the Main Sequence, Binary Sequence (+0.75 mag above MS), and Red Giant Branch.",
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from astropy import units as u
from astropy.coordinates import Distance

# Load Gaia DR3 cluster sample (columns: source_id, parallax_mas, parallax_err, phot_g_mean_mag, bp_rp, ruwe)
df = pd.read_csv("gaia_dr3_m67_sample.csv")

# 1. Quality cuts: high signal-to-noise parallax & clean astrometric solution (RUWE < 1.4)
clean = df[(df["parallax_mas"] / df["parallax_err"] > 10) & (df["ruwe"] < 1.4)].copy()

# 2. Compute Astropy distances and Absolute G Magnitude
distances_pc = Distance(parallax=clean["parallax_mas"].values * u.mas).pc
clean["M_G"] = clean["phot_g_mean_mag"] - 5.0 * np.log10(distances_pc) + 5.0

# 3. Plot Color-Magnitude Diagram (CMD)
fig, ax = plt.subplots(figsize=(8, 6), dpi=150)
sc = ax.scatter(clean["bp_rp"], clean["M_G"], s=10, c=clean["bp_rp"], cmap="coolwarm", alpha=0.8)
ax.invert_yaxis()  # Brighter stars at top (astrophysical convention)
ax.set_xlabel(r"Color Index $(G_{\\mathrm{BP}} - G_{\\mathrm{RP}})$ [mag]")
ax.set_ylabel(r"Absolute Magnitude $M_G$")
ax.set_title("Gaia DR3 Empirical H-R Diagram (M67 Turnoff Analysis)")
ax.grid(alpha=0.2, linestyle="--")
plt.colorbar(sc, label="BP - RP Color")
plt.tight_layout()
plt.savefig("m67_cmd_gaia_dr3.png")`
  },
  {
    id: "lane-emden-polytrope",
    title: "Project 2: Numerical Integration of the Lane-Emden Stellar Structure Equation",
    libraries: ["numpy", "scipy", "matplotlib"],
    datasetSource: "Analytical Polytropic EOS (n = 1.5 convective dwarf, n = 3.0 Eddington radiative star)",
    objective: "Solve the dimensionless second-order Lane-Emden differential equation via 4th-order Runge-Kutta (scipy.integrate.solve_ivp) to determine internal density profiles ρ(r)/ρ_c.",
    astrophysicsConcept: "Hydrostatic equilibrium + Poisson's gravitational equation with polytropic equation of state P = K ρ^(1 + 1/n).",
    expectedOutput: "Dimensionless stellar surface radius ξ₁ (3.6538 for n=1.5; 6.8968 for n=3.0) and central-to-mean density concentration ρ_c / <ρ> = 54.18 for n=3.",
    code: `import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

def lane_emden_ode(xi, y, n):
    theta, phi = y  # phi = d(theta)/d(xi)
    if xi < 1e-8:
        return [phi, -1.0 / 3.0]
    if theta <= 0:
        return [0.0, 0.0]
    return [phi, -(2.0 / xi) * phi - (theta ** n)]

def surface_event(xi, y, n):
    return y[0]
surface_event.terminal = True
surface_event.direction = -1

fig, ax = plt.subplots(figsize=(8, 5), dpi=150)
for n, label in [(1.5, "n = 1.5 (Fully Convective M-Dwarf / Non-Rel WD)"),
                 (3.0, "n = 3.0 (Eddington Standard Model / Relativistic WD)")]:
    sol = solve_ivp(lane_emden_ode, [1e-6, 12.0], [1.0, 0.0],
                    args=(n,), events=surface_event, dense_output=True, rtol=1e-9)
    xi_surface = sol.t_events[0][0]
    dtheta_surf = sol.y_events[0][0][1]
    rho_ratio = -xi_surface / (3.0 * dtheta_surf)
    print(f"{label}: xi_1 = {xi_surface:.4f}, rho_c / <rho> = {rho_ratio:.2f}")
    ax.plot(sol.t / xi_surface, np.maximum(sol.y[0], 0)**n, label=f"n={n} (conc={rho_ratio:.1f})")

ax.set_xlabel(r"Normalized Radius $r / R_\\star$")
ax.set_ylabel(r"Normalized Density $\\rho(r) / \\rho_c$")
ax.set_title("Polytropic Stellar Interior Density Profiles")
ax.legend()
ax.grid(alpha=0.25)
plt.tight_layout()
plt.savefig("lane_emden_profiles.png")`
  },
  {
    id: "planck-spectrophotometry",
    title: "Project 3: Blackbody Effective Temperature & Radius Fit from Multi-Band Spectrophotometry",
    libraries: ["numpy", "scipy", "astropy", "matplotlib"],
    datasetSource: "Multi-band UV/Optical/NIR Spectral Energy Distribution (Vega / Sirus / Proxima)",
    objective: "Fit Planck's blackbody law with astropy.constants using non-linear least squares (scipy.optimize.curve_fit) to extract stellar T_eff and angular diameter θ.",
    astrophysicsConcept: "Planck radiation law B_λ(T), Wien's displacement law, and flux dilution factor F_λ = (θ/2)² π B_λ(T).",
    expectedOutput: "Best-fit T_eff ± σ_T (K), angular radius in milliarcseconds, and reduced χ² goodness-of-fit.",
    code: `import numpy as np
from scipy.optimize import curve_fit
from astropy import constants as const, units as u
import matplotlib.pyplot as plt

h = const.h.cgs.value
c = const.c.cgs.value
k_B = const.k_B.cgs.value

def observed_flux_model(lam_cm, T_eff, theta_rad):
    # F_lambda = (theta / 2)^2 * pi * B_lambda(T)
    exponent = np.clip((h * c) / (lam_cm * k_B * T_eff), 1e-6, 700.0)
    B_lam = (2.0 * h * c**2 / lam_cm**5) / (np.exp(exponent) - 1.0)
    return ((theta_rad / 2.0) ** 2) * np.pi * B_lam

# Example synthetic UBVRIJHK wavelengths (cm) & calibrated flux (erg/s/cm^2/cm)
wavelengths_nm = np.array([365, 445, 551, 658, 806, 1220, 1630, 2190])
lam_cm = wavelengths_nm * 1e-7
true_T, true_theta = 5772.0, 9.30e-3 * (np.pi / (180 * 3600 * 1000)) # Solar at 1 pc approx
flux_obs = observed_flux_model(lam_cm, true_T, true_theta) * (1 + np.random.normal(0, 0.02, len(lam_cm)))

popt, pcov = curve_fit(observed_flux_model, lam_cm, flux_obs, p0=[5500.0, 4e-8])
perr = np.sqrt(np.diag(pcov))
print(f"Fitted T_eff = {popt[0]:.1f} +/- {perr[0]:.1f} K")
print(f"Angular Diameter = {popt[1] * 206264806.2:.3f} mas")`
  }
];
