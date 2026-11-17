import { StarProfile } from "../types/astrophysics";

export const STARS_CATALOG: StarProfile[] = [
  {
    id: "sun",
    name: "The Sun (Sol)",
    designation: "G2V Standard Reference Star",
    constellation: "Local Interstellar Cloud",
    spectralType: "G2V",
    spectralClassGroup: "G",
    colorHex: "#FDE68A",
    galacticLocation: "Orion-Cygnus Spur, Milky Way (~8.18 kpc from Galactic Center)",
    distance: {
      value: "1.000 AU (149,597,870.7 km)",
      numericValue: 0.0000158,
      unit: "ly",
      certainty: "Measured",
      note: "Defined exact AU via radar ranging and spacecraft ephemerides (IAU 2012)."
    },
    classification: "G2V Main-Sequence Yellow Dwarf (Population I)",
    mass: {
      value: "1.000 M☉ (1.9884 × 10³⁰ kg)",
      numericValue: 1.0,
      unit: "M☉",
      certainty: "Measured",
      note: "Derived directly from planetary orbital dynamics (GM☉)."
    },
    radius: {
      value: "1.000 R☉ (695,700 km)",
      numericValue: 1.0,
      unit: "R☉",
      certainty: "Measured",
      note: "Nominal IAU 2015 solar radius via helioseismology and solar eclipse/limb timing."
    },
    temperature: {
      value: "5,772 K (effective photosphere)",
      numericValue: 5772,
      unit: "K",
      certainty: "Measured",
      note: "Calculated via Stefan-Boltzmann law from Total Solar Irradiance (1,361 W/m²) and R☉."
    },
    luminosity: {
      value: "1.000 L☉ (3.828 × 10²⁶ W)",
      numericValue: 1.0,
      unit: "L☉",
      certainty: "Measured",
      note: "Measured continuously by space radiometers (SORCE, TSIS-1)."
    },
    age: {
      value: "4.603 ± 0.010 Gyr",
      numericValue: 4.603,
      unit: "Gyr",
      certainty: "Measured",
      note: "Radiometric Pb-Pb dating of the oldest solar system CAIs in meteorites."
    },
    evolutionaryStage: "Core Hydrogen-Burning Main Sequence (46% through MS lifetime)",
    scientificImportance: "Serves as the absolute calibration benchmark for all stellar masses, radii, luminosities, helioseismology, and solar-stellar dynamo physics.",
    unusualCharacteristics: "Exhibits an anomalously low lithium abundance compared to solar twins and hosts an 11-year Schwabe / 22-year Hale magnetic polarity cycle.",
    latestResearch: "Parker Solar Probe and Solar Orbiter in-situ measurements inside the Alfvén critical surface are resolving magnetic switchbacks driving coronal heating and fast solar wind acceleration.",
    hrCoordinates: { teffK: 5772, lumSolar: 1.0 }
  },
  {
    id: "sirius",
    name: "Sirius (α Canis Majoris)",
    designation: "α CMa A / B",
    constellation: "Canis Major",
    spectralType: "A1V + DA2",
    spectralClassGroup: "A",
    colorHex: "#DBEAFE",
    galacticLocation: "Local Bubble, Orion Spur (α = 06h 45m, δ = −16° 43′)",
    distance: {
      value: "8.60 ± 0.04 ly (2.637 pc)",
      numericValue: 8.6,
      unit: "ly",
      certainty: "Measured",
      note: "Hipparcos and HST astrometric parallax (379.21 ± 1.58 mas); too bright for standard Gaia DR3 astrometry."
    },
    classification: "Astrophysical Binary: A1V Main Sequence + DA2 White Dwarf",
    mass: {
      value: "2.063 ± 0.023 M☉ (A) · 1.018 ± 0.011 M☉ (B)",
      numericValue: 2.063,
      unit: "M☉",
      certainty: "Measured",
      note: "Dynamical mass directly measured from the 50.13-year visual binary orbit (Bond et al. 2017)."
    },
    radius: {
      value: "1.711 ± 0.013 R☉ (A) · 0.00809 R☉ (B)",
      numericValue: 1.711,
      unit: "R☉",
      certainty: "Measured",
      note: "Sirius A measured via VLTI optical interferometry; Sirius B constrained via gravitational redshift + HST spectra."
    },
    temperature: {
      value: "9,940 ± 210 K (A) · 25,193 K (B)",
      numericValue: 9940,
      unit: "K",
      certainty: "Measured",
      note: "Spectrophotometry and Balmer line profile fitting."
    },
    luminosity: {
      value: "25.4 L☉ (A) · 0.056 L☉ (B)",
      numericValue: 25.4,
      unit: "L☉",
      certainty: "Measured",
      note: "Bolometric flux integration combined with precise dynamical parallax."
    },
    age: {
      value: "228–242 Myr",
      numericValue: 0.24,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Derived from white dwarf cooling age of Sirius B (~126 Myr) plus ~5 M☉ progenitor MS lifetime."
    },
    evolutionaryStage: "Sirius A: Main Sequence · Sirius B: Carbon-Oxygen White Dwarf",
    scientificImportance: "Sirius B provided the first empirical confirmation of gravitational redshift predicted by General Relativity and relativistic electron degeneracy.",
    unusualCharacteristics: "Sirius A shows Am-star metallic-line enrichment ([Fe/H] ≈ +0.50), potentially accreted from Sirius B's asymptotic giant branch wind.",
    latestResearch: "HST STIS spectroscopy measured Sirius B's gravitational redshift at +80.65 ± 0.77 km/s, tightly matching the mass-radius relation for a degenerate carbon-oxygen core.",
    hrCoordinates: { teffK: 9940, lumSolar: 25.4 }
  },
  {
    id: "proxima-centauri",
    name: "Proxima Centauri",
    designation: "α Centauri C / GJ 551",
    constellation: "Centaurus",
    spectralType: "M5.5Ve",
    spectralClassGroup: "M",
    colorHex: "#FB7185",
    galacticLocation: "Nearest known star to the Sun, outer bound member of α Cen triple",
    distance: {
      value: "4.2465 ± 0.0003 ly (1.3019 pc)",
      numericValue: 4.2465,
      unit: "ly",
      certainty: "Measured",
      note: "Gaia DR3 trigonometric parallax (768.0665 ± 0.0499 mas)."
    },
    classification: "M5.5Ve Red Dwarf Flare Star",
    mass: {
      value: "0.1221 ± 0.0022 M☉",
      numericValue: 0.122,
      unit: "M☉",
      certainty: "Model-Estimated",
      note: "Mass-luminosity relation calibrated against dynamically weighed M-dwarf binaries."
    },
    radius: {
      value: "0.1542 ± 0.0045 R☉",
      numericValue: 0.154,
      unit: "R☉",
      certainty: "Measured",
      note: "Angular diameter measured via VLTI PIONIER/VINCI optical interferometry."
    },
    temperature: {
      value: "2,992 ± 50 K",
      numericValue: 2992,
      unit: "K",
      certainty: "Measured",
      note: "Bolometric flux and interferometric angular radius."
    },
    luminosity: {
      value: "0.00155 L☉ (bolometric)",
      numericValue: 0.00155,
      unit: "L☉",
      certainty: "Measured",
      note: "Dominated by near-infrared emission; visible luminosity is only ~0.00005 L☉."
    },
    age: {
      value: "~4.85 Gyr",
      numericValue: 4.85,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Inferred from its kinematic association with α Centauri AB."
    },
    evolutionaryStage: "Fully Convective Main-Sequence Red Dwarf (expected MS lifespan ~4 trillion years)",
    scientificImportance: "Hosts Proxima Centauri b, the closest terrestrial-mass habitable-zone exoplanet, making it a critical testbed for M-dwarf habitability and stellar flare erosion.",
    unusualCharacteristics: "Fully convective interior mixes fresh hydrogen continuously into the core; experiences violent superflares releasing up to 10³³ ergs in UV/X-rays.",
    latestResearch: "ESPRESSO radial velocity campaigns confirmed Proxima d (0.26 M⊕) and JWST/ALMA observations constrain stellar flare millimeter emission and exoplanet atmospheric retention.",
    hrCoordinates: { teffK: 2992, lumSolar: 0.00155 }
  },
  {
    id: "alpha-centauri",
    name: "Alpha Centauri (Rigil Kentaurus)",
    designation: "α Cen AB",
    constellation: "Centaurus",
    spectralType: "G2V + K1V",
    spectralClassGroup: "G",
    colorHex: "#FDE047",
    galacticLocation: "Nearest stellar system to the Solar System (4.34 ly)",
    distance: {
      value: "4.344 ± 0.004 ly (1.332 pc)",
      numericValue: 4.344,
      unit: "ly",
      certainty: "Measured",
      note: "Precision parallax and 79.9-year astrometric binary solution (Kervella et al. 2016)."
    },
    classification: "Visual Binary: G2V (A) + K1V (B) (gravitationally bound to Proxima C)",
    mass: {
      value: "1.0788 ± 0.0029 M☉ (A) · 0.9092 ± 0.0025 M☉ (B)",
      numericValue: 1.079,
      unit: "M☉",
      certainty: "Measured",
      note: "Keplerian dynamical solution from decades of astrometry and radial velocities."
    },
    radius: {
      value: "1.2175 ± 0.0055 R☉ (A) · 0.8591 ± 0.0036 R☉ (B)",
      numericValue: 1.218,
      unit: "R☉",
      certainty: "Measured",
      note: "VLTI/PIONIER interferometric angular diameters + asteroseismic p-mode oscillations."
    },
    temperature: {
      value: "5,790 K (A) · 5,260 K (B)",
      numericValue: 5790,
      unit: "K",
      certainty: "Measured",
      note: "High-resolution HARPS spectroscopy and interferometric Teff calibration."
    },
    luminosity: {
      value: "1.506 L☉ (A) · 0.498 L☉ (B)",
      numericValue: 1.506,
      unit: "L☉",
      certainty: "Measured",
      note: "Direct bolometric flux and precise binary parallax."
    },
    age: {
      value: "5.0–5.5 Gyr",
      numericValue: 5.2,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Joint asteroseismic and stellar evolution fitting of both stars simultaneously."
    },
    evolutionaryStage: "Main Sequence Solar-Analog Pair (α Cen A slightly more evolved than the Sun)",
    scientificImportance: "Provides the tightest observational constraints on stellar evolution models outside the Sun because both stars share identical age and initial composition ([Fe/H] ≈ +0.23).",
    unusualCharacteristics: "α Cen A sits near the convective-core transition threshold (~1.1 M☉), serving as a razor-sharp probe of convective overshooting physics.",
    latestResearch: "JWST MIRI coronagraphic imaging and VLT NEAR observations are probing the habitable zone of α Cen A for a candidate giant/sub-Neptune planet.",
    hrCoordinates: { teffK: 5790, lumSolar: 1.506 }
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse (α Orionis)",
    designation: "α Ori",
    constellation: "Orion",
    spectralType: "M1–M2 Ia–ab",
    spectralClassGroup: "M",
    colorHex: "#F97316",
    galacticLocation: "Orion OB1 Association region (high-velocity runaway star ~30 km/s)",
    distance: {
      value: "548 +90/−49 ly (168 pc) — range 500–650 ly",
      numericValue: 548,
      unit: "ly",
      certainty: "Uncertain / Debated",
      note: "Too bright and photocenter-variable for Gaia; VLBI radio + Hipparcos + seismic constraints yield 168–222 pc."
    },
    classification: "M1–2 Ia–ab Semiregular Red Supergiant (SRc)",
    mass: {
      value: "16.5–19 M☉ (initial ~18–20 M☉)",
      numericValue: 17.5,
      unit: "M☉",
      certainty: "Model-Estimated",
      note: "Derived via asteroseismic fundamental/overtone pulsation modeling (Joyce et al. 2020)."
    },
    radius: {
      value: "~764 R☉ (varies ~640–1,000 R☉ with distance & wavelength)",
      numericValue: 764,
      unit: "R☉",
      certainty: "Uncertain / Debated",
      note: "Interferometric angular diameter (~42 mas) depends linearly on debated distance and molecular MOLsphere opacity."
    },
    temperature: {
      value: "3,600 ± 200 K",
      numericValue: 3600,
      unit: "K",
      certainty: "Measured",
      note: "TiO band spectrophotometry; drops transiently during convective surface dimming."
    },
    luminosity: {
      value: "~126,000 L☉ (scales as d²)",
      numericValue: 126000,
      unit: "L☉",
      certainty: "Uncertain / Debated",
      note: "Directly coupled to the ~15–20% distance uncertainty."
    },
    age: {
      value: "8–10 Myr",
      numericValue: 0.009,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Evolutionary tracks for 18–20 M☉ stars; may reflect a past binary merger."
    },
    evolutionaryStage: "Core Helium Burning (or early Carbon burning) Red Supergiant; core collapse within ~100,000 yr",
    scientificImportance: "Closest red supergiant to Earth, permitting direct surface resolution of giant convective cells and mass-loss mechanisms preceding Type II-P supernovae.",
    unusualCharacteristics: "Underwent the historic 'Great Dimming' (late 2019–2020, dropping >1 mag) caused by a massive surface mass ejection condensing into circumstellar silicate dust.",
    latestResearch: "2024–2025 radial-velocity and astrometric analyses investigate whether its 2,170-day Long Secondary Period is caused by a low-mass binary companion ('Betelbuddy') clearing dust.",
    hrCoordinates: { teffK: 3600, lumSolar: 126000 }
  },
  {
    id: "rigel",
    name: "Rigel (β Orionis)",
    designation: "β Ori A",
    constellation: "Orion",
    spectralType: "B8 Ia",
    spectralClassGroup: "B",
    colorHex: "#93C5FD",
    galacticLocation: "Orion OB1b association, illuminating the Witch Head Nebula (IC 2118)",
    distance: {
      value: "863 ± 68 ly (264 pc)",
      numericValue: 863,
      unit: "ly",
      certainty: "Measured",
      note: "Hipparcos parallax (3.78 ± 0.34 mas), consistent with Orion OB1b association kinematics."
    },
    classification: "B8 Ia Blue Supergiant (α Cygni variable, quadruple system)",
    mass: {
      value: "21 ± 3 M☉",
      numericValue: 21,
      unit: "M☉",
      certainty: "Model-Estimated",
      note: "Evolutionary tracks matched to spectroscopic surface gravity and luminosity."
    },
    radius: {
      value: "78.9 ± 7.4 R☉",
      numericValue: 78.9,
      unit: "R☉",
      certainty: "Measured",
      note: "CHARA Array infrared interferometric angular diameter (2.75 mas) + Hipparcos distance."
    },
    temperature: {
      value: "12,100 ± 150 K",
      numericValue: 12100,
      unit: "K",
      certainty: "Measured",
      note: "Non-LTE stellar atmosphere modeling of Balmer and He I lines."
    },
    luminosity: {
      value: "~120,000 L☉",
      numericValue: 120000,
      unit: "L☉",
      certainty: "Model-Estimated",
      note: "Bolometric correction applied to visual magnitude and distance."
    },
    age: {
      value: "7–9 Myr",
      numericValue: 0.008,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Derived from massive star evolutionary isochrones."
    },
    evolutionaryStage: "Post-Main-Sequence Blue Supergiant (likely H-shell burning or post-RSG blue loop)",
    scientificImportance: "Prototype B-type supergiant used to calibrate line-driven stellar winds, non-radial gravity-mode pulsations, and extragalactic blue supergiant distance indicators.",
    unusualCharacteristics: "Exhibits simultaneous multi-periodic micro-variations in brightness and Hα wind emission caused by gravity waves and clumped stellar winds.",
    latestResearch: "TESS high-cadence photometry and long-term spectroscopic monitoring reveal stochastic low-frequency variability generated by subsurface convective zones and internal gravity waves.",
    hrCoordinates: { teffK: 12100, lumSolar: 120000 }
  },
  {
    id: "vega",
    name: "Vega (α Lyrae)",
    designation: "α Lyr",
    constellation: "Lyra",
    spectralType: "A0Va",
    spectralClassGroup: "A",
    colorHex: "#E0F2FE",
    galacticLocation: "Castor Moving Group neighborhood (25.04 ly)",
    distance: {
      value: "25.04 ± 0.07 ly (7.68 pc)",
      numericValue: 25.04,
      unit: "ly",
      certainty: "Measured",
      note: "Hipparcos trigonometric parallax (130.23 ± 0.36 mas)."
    },
    classification: "A0Va Rapidly Rotating Main-Sequence Star (pole-on)",
    mass: {
      value: "2.135 ± 0.074 M☉",
      numericValue: 2.135,
      unit: "M☉",
      certainty: "Model-Estimated",
      note: "Oblate Roche-model atmosphere fitting combined with interferometric profile."
    },
    radius: {
      value: "2.362 R☉ (polar) · 2.818 R☉ (equatorial)",
      numericValue: 2.59,
      unit: "R☉",
      certainty: "Measured",
      note: "CHARA & NPOI optical interferometry directly resolved its oblate rotational flattening."
    },
    temperature: {
      value: "9,602 K (mean) · 10,070 K (poles) · 8,152 K (equator)",
      numericValue: 9602,
      unit: "K",
      certainty: "Measured",
      note: "Von Zeipel gravity darkening resolved across its disk via interferometry."
    },
    luminosity: {
      value: "40.12 ± 0.45 L☉ (apparent polar flux ~57 L☉)",
      numericValue: 40.12,
      unit: "L☉",
      certainty: "Measured",
      note: "Integrated over oblate geometry corrected for pole-on viewing inclination (~5°)."
    },
    age: {
      value: "455 ± 13 Myr",
      numericValue: 0.455,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Rotating stellar evolution tracks matched to interferometric luminosity and radii."
    },
    evolutionaryStage: "Main Sequence Core Hydrogen Burning (near mid-MS)",
    scientificImportance: "Historic photometric zero-point (V ≈ 0.03) of the UBV magnitude system and prototype debris-disk host.",
    unusualCharacteristics: "Rotates at ~90% of breakup velocity (~236 km/s equatorial), flattening the star by ~20% and creating a 1,900 K temperature gradient between pole and equator.",
    latestResearch: "2024 JWST NIRCam & MIRI coronagraphy imaged Vega's extraordinarily smooth ~100 AU debris disk, showing minimal dynamical sculpting by massive planets inside 60 AU.",
    hrCoordinates: { teffK: 9602, lumSolar: 40.12 }
  },
  {
    id: "polaris",
    name: "Polaris (α Ursae Minoris)",
    designation: "α UMi Aa",
    constellation: "Ursa Minor",
    spectralType: "F7Ib",
    spectralClassGroup: "F",
    colorHex: "#FEF3C7",
    galacticLocation: "North Celestial Pole alignment (~447 ly, triple star system)",
    distance: {
      value: "447.6 ± 1.6 ly (137.2 pc) via Polaris B Gaia DR3",
      numericValue: 447.6,
      unit: "ly",
      certainty: "Measured",
      note: "Gaia DR3 parallax of wide companion Polaris B (7.288 mas) resolves decades of Cepheid distance tension."
    },
    classification: "F7Ib Classical Type I Cepheid Supergiant (first-overtone pulsator)",
    mass: {
      value: "5.13 ± 0.28 M☉ (dynamical)",
      numericValue: 5.13,
      unit: "M☉",
      certainty: "Measured",
      note: "CHARA interferometry + HST astrometry of inner companion α UMi Ab (29.6-yr orbit, Evans et al. 2024)."
    },
    radius: {
      value: "46.2 ± 0.4 R☉",
      numericValue: 46.2,
      unit: "R☉",
      certainty: "Measured",
      note: "Direct CHARA Array angular diameter (3.12 mas) + Gaia DR3 companion distance (Evans et al. 2024)."
    },
    temperature: {
      value: "~6,015 K",
      numericValue: 6015,
      unit: "K",
      certainty: "Measured",
      note: "Spectroscopic excitation and line-depth ratios across its 3.97-day pulsation cycle."
    },
    luminosity: {
      value: "~2,500 L☉",
      numericValue: 2500,
      unit: "L☉",
      certainty: "Measured",
      note: "Computed from bolometric flux and Polaris B Gaia DR3 distance."
    },
    age: {
      value: "~55–65 Myr",
      numericValue: 0.06,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Cepheid evolutionary mass-age relation shows an apparent over-luminosity mystery."
    },
    evolutionaryStage: "Core Helium Burning Instability Strip (Classical Cepheid)",
    scientificImportance: "Nearest Classical Cepheid variable, serving as a direct dynamical mass and radius anchor for the cosmic Cepheid Period-Luminosity (Leavitt) Law.",
    unusualCharacteristics: "Pulsation period lengthens steadily by ~4.5 s/yr while amplitude dramatically weakened during the 20th century before partially rebounding.",
    latestResearch: "2024 CHARA Array interferometric imaging directly resolved bright and dark surface spots on Polaris alongside the dynamical mass (~5.13 M☉), highlighting the 'Cepheid mass discrepancy' (brighter than 5 M☉ single-star models predict).",
    hrCoordinates: { teffK: 6015, lumSolar: 2500 }
  },
  {
    id: "antares",
    name: "Antares (α Scorpii)",
    designation: "α Sco A",
    constellation: "Scorpius",
    spectralType: "M1.5 Iab + B2.5V",
    spectralClassGroup: "M",
    colorHex: "#EF4444",
    galacticLocation: "Scorpius-Centaurus OB Association (Upper Scorpius subgroup)",
    distance: {
      value: "550 ± 100 ly (~170 pc)",
      numericValue: 550,
      unit: "ly",
      certainty: "Uncertain / Debated",
      note: "Hipparcos parallax (5.89 ± 1.00 mas) corroborated by Upper Sco subgroup membership (~145–170 pc)."
    },
    classification: "M1.5 Iab-Ib Red Supergiant + B2.5V Companion",
    mass: {
      value: "11–14 M☉ (initial ~15 M☉)",
      numericValue: 12.5,
      unit: "M☉",
      certainty: "Model-Estimated",
      note: "Evolutionary track fitting for Upper Sco cluster age (~11–15 Myr)."
    },
    radius: {
      value: "~680 R☉",
      numericValue: 680,
      unit: "R☉",
      certainty: "Model-Estimated",
      note: "VLTI AMBER interferometric angular diameter (~37–41 mas) scaled by distance."
    },
    temperature: {
      value: "3,660 ± 120 K",
      numericValue: 3660,
      unit: "K",
      certainty: "Measured",
      note: "Near-IR CO and optical TiO spectrophotometry."
    },
    luminosity: {
      value: "~75,900 L☉",
      numericValue: 75900,
      unit: "L☉",
      certainty: "Model-Estimated",
      note: "Bolometric integration combined with ~170 pc distance estimate."
    },
    age: {
      value: "11–15 Myr",
      numericValue: 0.013,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Consistent with Upper Scorpius OB association turnoff age."
    },
    evolutionaryStage: "Advanced Core Helium / Carbon-Burning Red Supergiant",
    scientificImportance: "Its hot B2.5V companion illuminates Antares' wind from inside, acting as an astrophysical probe of RSG wind ionization, mass loss, and chemical enrichment.",
    unusualCharacteristics: "VLTI velocity-resolved interferometry revealed unexpected supersonic turbulent upwelling plumes extending far above its photosphere beyond pure convection theory.",
    latestResearch: "ALMA + VLA multi-wavelength radio imaging mapped Antares' extended chromosphere out to 12 stellar radii, revealing temperatures peaking near 3,800 K in the inner radio atmosphere.",
    hrCoordinates: { teffK: 3660, lumSolar: 75900 }
  },
  {
    id: "deneb",
    name: "Deneb (α Cygni)",
    designation: "α Cyg",
    constellation: "Cygnus",
    spectralType: "A2 Ia",
    spectralClassGroup: "A",
    colorHex: "#E0F2FE",
    galacticLocation: "Cygnus OB7 association region (Orion Arm)",
    distance: {
      value: "~2,615 ly (802 pc) — range 1,400–2,700 ly",
      numericValue: 2615,
      unit: "ly",
      certainty: "Uncertain / Debated",
      note: "Hipparcos re-reduction gives 1.25 ± 0.32 mas (~802 pc), while Cygnus OB7 membership favors ~800 pc."
    },
    classification: "A2 Ia Luminous Blue-White Supergiant (Prototype α Cygni Variable)",
    mass: {
      value: "~19 ± 4 M☉",
      numericValue: 19,
      unit: "M☉",
      certainty: "Model-Estimated",
      note: "Spectroscopic gravity and evolutionary modeling assuming 802 pc distance."
    },
    radius: {
      value: "~203 ± 17 R☉",
      numericValue: 203,
      unit: "R☉",
      certainty: "Uncertain / Debated",
      note: "NPOI interferometric angular diameter (2.40 mas) scaled by uncertain distance."
    },
    temperature: {
      value: "8,525 ± 75 K",
      numericValue: 8525,
      unit: "K",
      certainty: "Measured",
      note: "Non-LTE spectral synthesis of optical absorption lines."
    },
    luminosity: {
      value: "~196,000 L☉",
      numericValue: 196000,
      unit: "L☉",
      certainty: "Uncertain / Debated",
      note: "Among the most intrinsically luminous stars within 1 kpc; uncertainty dominated by distance."
    },
    age: {
      value: "~8–10 Myr",
      numericValue: 0.009,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Evolutionary tracks suggest initial mass ~20–25 M☉."
    },
    evolutionaryStage: "Post-Main-Sequence Supergiant (possibly post-RSG returning toward blue or core-He burning)",
    scientificImportance: "Prototype of α Cygni non-radial pulsating supergiants; bright enough to serve as a local benchmark for extragalactic Flux-Weighted Gravity–Luminosity Relation (FGLR) distances.",
    unusualCharacteristics: "Simultaneously excites dozens of non-radial pulsation modes (periods 12–100 days) alongside episodic discrete mass-loss shells in its Hα P-Cygni wind profile.",
    latestResearch: "High-cadence space photometry and TESS observations link its micro-variability to strange-mode instabilities near the Eddington limit.",
    hrCoordinates: { teffK: 8525, lumSolar: 196000 }
  },
  {
    id: "eta-carinae",
    name: "Eta Carinae (η Car)",
    designation: "η Car A + B",
    constellation: "Carina",
    spectralType: "LBV + O-type Binary",
    spectralClassGroup: "LBV",
    colorHex: "#60A5FA",
    galacticLocation: "Trumpler 16 cluster, Carina Nebula (NGC 3372), Carina-Sagittarius Arm",
    distance: {
      value: "7,500 ± 300 ly (2.30 ± 0.10 kpc)",
      numericValue: 7500,
      unit: "ly",
      certainty: "Measured",
      note: "Geometric expansion parallax of the Homunculus Nebula bipolar lobes (Smith 2006) + Gaia DR3 Trumpler 16 cluster stars."
    },
    classification: "Luminous Blue Variable (LBV) + Hot O/WR Companion (e = 0.90, P = 5.54 yr)",
    mass: {
      value: "~100 M☉ (primary A) · ~30–40 M☉ (companion B)",
      numericValue: 100,
      unit: "M☉",
      certainty: "Model-Estimated",
      note: "Inferred from Eddington luminosity limit (>5 × 10⁶ L☉) and binary colliding-wind X-ray orbit."
    },
    radius: {
      value: "~60–240 R☉ (optically thick wind pseudo-photosphere)",
      numericValue: 120,
      unit: "R☉",
      certainty: "Uncertain / Debated",
      note: "Hydrostatic core obscured by dense stellar wind (~10⁻³ M☉/yr); apparent radius depends on wavelength."
    },
    temperature: {
      value: "~9,400–35,000 K (pseudo-photosphere vs hydrostatic core)",
      numericValue: 18000,
      unit: "K",
      certainty: "Uncertain / Debated",
      note: "Dense wind reprocesses ionizing UV flux into cooler optical continuum."
    },
    luminosity: {
      value: "~5.0 × 10⁶ L☉ (combined system)",
      numericValue: 5000000,
      unit: "L☉",
      certainty: "Measured",
      note: "Integrated far-infrared re-radiated dust luminosity of the Homunculus Nebula + known 2.3 kpc distance."
    },
    age: {
      value: "~2.5–3.0 Myr",
      numericValue: 0.003,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Trumpler 16 cluster evolutionary turnoff."
    },
    evolutionaryStage: "Unstable Luminous Blue Variable approaching Wolf-Rayet transition and Core Collapse",
    scientificImportance: "Most luminous well-studied binary near Earth; its 1837–1856 Great Eruption ejected >10 M☉, proving eruptive mass loss dominates very massive star evolution.",
    unusualCharacteristics: "Light echoes of the 1843 Great Eruption revealed ~20,000 km/s fast ejecta consistent with a violent triple-star merger or stellar-collision trigger.",
    latestResearch: "Chandra X-ray, ALMA submillimeter, and JWST observations monitor the 5.54-year periastron shock collisions and dusty molecular torus around the central binary.",
    hrCoordinates: { teffK: 18000, lumSolar: 5000000 }
  },
  {
    id: "vy-canis-majoris",
    name: "VY Canis Majoris",
    designation: "VY CMa",
    constellation: "Canis Major",
    spectralType: "M3–M5e Ia",
    spectralClassGroup: "M",
    colorHex: "#DC2626",
    galacticLocation: "NGC 2362 / Sharpless 310 star-forming complex",
    distance: {
      value: "3,820 ± 330 ly (1.17 ± 0.10 kpc)",
      numericValue: 3820,
      unit: "ly",
      certainty: "Measured",
      note: "VLBI H₂O and SiO maser trigonometric parallax (Zhang et al. 2012)."
    },
    classification: "Extreme Red Hypergiant (Oxygen-rich, extreme mass-losing)",
    mass: {
      value: "17 ± 8 M☉ (initial ~25–35 M☉)",
      numericValue: 17,
      unit: "M☉",
      certainty: "Model-Estimated",
      note: "Massive envelope shedding makes current mass strongly model-dependent."
    },
    radius: {
      value: "1,420 ± 120 R☉ (~6.6 AU)",
      numericValue: 1420,
      unit: "R☉",
      certainty: "Model-Estimated",
      note: "VLTI AMBER continuum interferometry + maser distance (Wittkowski et al. 2012)."
    },
    temperature: {
      value: "3,490 ± 90 K",
      numericValue: 3490,
      unit: "K",
      certainty: "Measured",
      note: "Continuum interferometric effective temperature."
    },
    luminosity: {
      value: "~270,000 L☉",
      numericValue: 270000,
      unit: "L☉",
      certainty: "Model-Estimated",
      note: "Integrated spectral energy distribution including heavy mid-IR dust envelope."
    },
    age: {
      value: "~8–10 Myr",
      numericValue: 0.009,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Massive star evolutionary phase approaching terminal collapse."
    },
    evolutionaryStage: "Extreme Post-RSG Red Hypergiant nearing direct collapse / core-collapse supernova",
    scientificImportance: "Key laboratory for understanding how extreme red hypergiants lose >10⁻⁴ M☉/yr via asymmetric giant convection and magnetic arcs.",
    unusualCharacteristics: "Surrounded by a sprawling complex of curved knots, filaments, and molecular arcs ejected asynchronously in localized surface eruptions over the past 1,000 years.",
    latestResearch: "ALMA molecular line mapping (SO, SO₂, NaCl, TiO₂) and HST spectroscopy traced localized mass ejections rivaling Betelgeuse's Great Dimming at vastly larger scales.",
    hrCoordinates: { teffK: 3490, lumSolar: 270000 }
  },
  {
    id: "uy-scuti",
    name: "UY Scuti",
    designation: "BD−12°5055",
    constellation: "Scutum",
    spectralType: "M2–M4 Ia–Iab",
    spectralClassGroup: "M",
    colorHex: "#EA580C",
    galacticLocation: "Scutum Star Cloud, Inner Milky Way Disk",
    distance: {
      value: "5,100–9,500 ly (~1.55–2.9 kpc)",
      numericValue: 5900,
      unit: "ly",
      certainty: "Uncertain / Debated",
      note: "Original Arroyo-Torres (2013) ~2.9 kpc model distance vs. Gaia DR2/DR3 parallaxes (~1.55–1.9 kpc, though high astrometric noise RUWE affects cool giants)."
    },
    classification: "M2–M4 Ia–Iab Semiregular Red Supergiant",
    mass: {
      value: "7–10 M☉ (initial ~20–25 M☉?)",
      numericValue: 8.5,
      unit: "M☉",
      certainty: "Uncertain / Debated",
      note: "Mass depends directly on luminosity and distance revision."
    },
    radius: {
      value: "~900–1,708 R☉ (revised ~755–1,100 R☉ at Gaia distances)",
      numericValue: 1100,
      unit: "R☉",
      certainty: "Uncertain / Debated",
      note: "2013 VLTI AMBER angular diameter (5.48 mas) gave 1,708 R☉ at 2.9 kpc; closer Gaia DR3 distances reduce radius substantially."
    },
    temperature: {
      value: "3,365 ± 134 K",
      numericValue: 3365,
      unit: "K",
      certainty: "Measured",
      note: "Near-IR interferometry and model-atmosphere spectrum fitting."
    },
    luminosity: {
      value: "~86,000–340,000 L☉",
      numericValue: 180000,
      unit: "L☉",
      certainty: "Uncertain / Debated",
      note: "Varies by a factor of ~3.5 between 1.55 kpc and 2.9 kpc distance scales."
    },
    age: {
      value: "~10–15 Myr",
      numericValue: 0.012,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Evolutionary tracks for intermediate-to-massive supergiants."
    },
    evolutionaryStage: "Core Helium or Shell-Burning Red Supergiant",
    scientificImportance: "Illustrates how atmospheric convection photocenter jitter and uncertain galactic extinction dramatically impact empirical radius estimates of supergiants.",
    unusualCharacteristics: "Long famous as a candidate 'largest known star', modern Gaia DR3 revisions demonstrate why Stephenson 2-18 or WOH G64 (~1,540 R☉) likely surpass its revised radius.",
    latestResearch: "Gaia DR3 astrometry and extinction re-evaluations highlight the necessity of accounting for convective photocenter shifts when deriving RSG radii.",
    hrCoordinates: { teffK: 3365, lumSolar: 180000 }
  },
  {
    id: "r136a1",
    name: "R136a1 (RMC 136a1)",
    designation: "BAT99 108",
    constellation: "Dorado (LMC)",
    spectralType: "WN5h",
    spectralClassGroup: "O",
    colorHex: "#60A5FA",
    galacticLocation: "R136 super star cluster, Tarantula Nebula (30 Doradus), Large Magellanic Cloud",
    distance: {
      value: "163,000 ± 4,000 ly (49.97 ± 0.19 kpc)",
      numericValue: 163000,
      unit: "ly",
      certainty: "Measured",
      note: "Eclipsing binary distance calibration to the Large Magellanic Cloud (Pietrzyński et al. 2019)."
    },
    classification: "WN5h Hydrogen-Rich Wolf-Rayet / Extreme O-Star",
    mass: {
      value: "170–230 M☉ (initial ~200–250 M☉)",
      numericValue: 196,
      unit: "M☉",
      certainty: "Uncertain / Debated",
      note: "2022 Gemini South Zorro speckle imaging resolved crowding blends, revising mass down from 250–315 M☉ to ~170–230 M☉ (Kalari et al. 2022)."
    },
    radius: {
      value: "~39–43 R☉",
      numericValue: 41,
      unit: "R☉",
      certainty: "Model-Estimated",
      note: "Derived via Stefan-Boltzmann law from bolometric luminosity and Teff."
    },
    temperature: {
      value: "46,000 ± 4,000 K",
      numericValue: 46000,
      unit: "K",
      certainty: "Model-Estimated",
      note: "UV/optical CMFGEN non-LTE expanding wind atmosphere modeling (Bestenlehner et al. 2020)."
    },
    luminosity: {
      value: "~4.7–6.2 × 10⁶ L☉",
      numericValue: 5500000,
      unit: "L☉",
      certainty: "Model-Estimated",
      note: "High-resolution photometry + UV bolometric correction after resolving nearby cluster stars."
    },
    age: {
      value: "1.0–1.5 Myr",
      numericValue: 0.0012,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "R136 cluster youth; shows strong helium and nitrogen enrichment from rapid rotational/convective mixing."
    },
    evolutionaryStage: "Core Hydrogen-Burning Very Massive Star (VMS) with extreme radiation-driven mass loss",
    scientificImportance: "Most massive known star in the local universe, challenging the classical ~150 M☉ Eddington stellar upper mass limit and testing pair-instability supernova progenitors.",
    unusualCharacteristics: "Despite being only ~40 R☉ wide, it radiates millions of solar luminosities predominantly in extreme ultraviolet, shedding ~5 × 10⁻⁵ M☉/yr.",
    latestResearch: "Gemini Zorro optical speckle imaging (30 mas resolution) separated blended neighbors in R136, lowering R136a1's luminosity and mass estimates while keeping it the most massive star confirmed.",
    hrCoordinates: { teffK: 46000, lumSolar: 5500000 }
  },
  {
    id: "tabbys-star",
    name: "Tabby's Star (Boyajian's Star)",
    designation: "KIC 8462852 / TYC 3162-665-1",
    constellation: "Cygnus",
    spectralType: "F3V",
    spectralClassGroup: "F",
    colorHex: "#FEF9C3",
    galacticLocation: "Cygnus Galactic Plane (Kepler Field)",
    distance: {
      value: "1,470 ± 15 ly (451 ± 5 pc)",
      numericValue: 1470,
      unit: "ly",
      certainty: "Measured",
      note: "Gaia DR3 trigonometric parallax (2.217 ± 0.023 mas)."
    },
    classification: "F3V Main-Sequence Star (with an M-dwarf wide companion)",
    mass: {
      value: "~1.43 M☉",
      numericValue: 1.43,
      unit: "M☉",
      certainty: "Model-Estimated",
      note: "Spectroscopic log g and Teff matched to main-sequence F3V evolutionary tracks."
    },
    radius: {
      value: "~1.58 R☉",
      numericValue: 1.58,
      unit: "R☉",
      certainty: "Model-Estimated",
      note: "Derived from Gaia luminosity and spectroscopic Teff."
    },
    temperature: {
      value: "6,750 ± 120 K",
      numericValue: 6750,
      unit: "K",
      certainty: "Measured",
      note: "Keck HIRES high-resolution optical spectroscopy."
    },
    luminosity: {
      value: "~4.68 L☉",
      numericValue: 4.68,
      unit: "L☉",
      certainty: "Measured",
      note: "Derreddened photometry + Gaia DR3 distance."
    },
    age: {
      value: "~1–2 Gyr",
      numericValue: 1.5,
      unit: "Gyr",
      certainty: "Model-Estimated",
      note: "Main-sequence F3V age; lacks strong infrared excess expected for a young star."
    },
    evolutionaryStage: "Ordinary Core Hydrogen-Burning Main-Sequence F3V Star",
    scientificImportance: "Demonstrates how subtle wavelength-dependent optical dimming separates physical dust absorption from opaque solid structures in transit astrophysics.",
    unusualCharacteristics: "Exhibits aperiodic, asymmetric optical dips reaching up to 22% flux loss over days to weeks, alongside subtle secular dimming trends.",
    latestResearch: "Multi-band follow-up (Boyajian et al. 2018; Gaia/WISE/ground photometry) showed dips are significantly deeper in blue light than red light—proving sub-micron optically thin dust clouds (likely exocometary debris) rather than opaque megastructures.",
    hrCoordinates: { teffK: 6750, lumSolar: 4.68 }
  }
];
