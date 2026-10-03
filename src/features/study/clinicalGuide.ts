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

export function clinicalStagesFor(id: string) {
  return id === "slump"
    ? [
        "Objetivo e indicação",
        "Sentar com segurança",
        "Flexionar o tronco",
        "Flexionar a cervical",
        "Estender o joelho",
        "Dorsifletir o tornozelo",
        "Liberar a cervical",
        "Retornar e comparar",
        "Interpretar os achados",
        "Registrar a avaliação",
        "Praticar com casos",
        "Revisar e concluir",
      ]
    : clinicalStages;
}
export function parseClinicalStage(
  value: string | null,
  count: number = clinicalStages.length,
): number {
  if (value === null || !/^\d+$/.test(value)) return 0;
  const stage = Number(value);
  return Number.isInteger(stage) && stage >= 0 && stage < count ? stage : 0;
}
