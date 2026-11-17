import { MODULES_PART_1, ROADMAP_STAGES } from "./modulesPart1";
import { MODULES_PART_2 } from "./modulesPart2";
import { CurriculumModule } from "../types/astrophysics";

export { ROADMAP_STAGES };

export const CURRICULUM_MODULES: CurriculumModule[] = [
  ...MODULES_PART_1,
  ...MODULES_PART_2,
];
