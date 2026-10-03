export const clinicalStages = [
  "Objetivo e indicação",
  "Preparar com segurança",
  "Elevar o membro",
  "Observar a resposta",
  "Diferenciar os sintomas",
  "Retornar e comparar",
  "Interpretar os achados",
  "Registrar a avaliação",
  "Praticar com casos",
  "Revisar e concluir",
] as const;

export function parseClinicalStage(value: string | null): number {
  if (value === null || !/^\d+$/.test(value)) return 0;
  const stage = Number(value);
  return Number.isInteger(stage) && stage >= 0 && stage < clinicalStages.length
    ? stage
    : 0;
}
