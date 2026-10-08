import type { ClinicalAnimation } from "../../features/viewer/clinicalAnimation";
import { animacoesJoelho } from "./joelho";
import { animacoesLombar } from "./lombar";
import { animacoesPelve } from "./pelve";
import { animacoesQuadril } from "./quadril";
import { animacoesTornozelo } from "./tornozelo";

/** Animações 3D dos testes clínicos (exceto Lasègue e Slump, que têm motor
 *  próprio), uma lista de quadros-chave por passo do roteiro. */
export const clinicalAnimations: Record<string, ClinicalAnimation> = {
  ...animacoesLombar,
  ...animacoesPelve,
  ...animacoesQuadril,
  ...animacoesJoelho,
  ...animacoesTornozelo,
};
