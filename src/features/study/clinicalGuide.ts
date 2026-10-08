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

/** Etapas do roteiro guiado. Lasègue e Slump têm nomes próprios, alinhados
 *  às demonstrações 3D; os demais testes usam os títulos dos seus passos. */
export function clinicalStagesFor(
  test: string | { id: string; steps: { title: string }[] },
): readonly string[] {
  const id = typeof test === "string" ? test : test.id;
  if (id !== "slump" && id !== "lasegue" && typeof test !== "string")
    return [
      "Objetivo e indicação",
      ...test.steps.map((step) => step.title),
      "Interpretar os achados",
      "Registrar a avaliação",
      "Praticar com casos",
      "Revisar e concluir",
    ];
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
