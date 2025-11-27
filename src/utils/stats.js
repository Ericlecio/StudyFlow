const toNumber = (v) => Number(v) || 0;

export const calcularMediaAcertos = (resultados) => {
  if (!resultados.length) return 0;

  const totalAcertos = resultados.reduce(
    (s, r) => s + toNumber(r.acertos),
    0
  );
  const totalQuestoes = resultados.reduce(
    (s, r) => s + toNumber(r.acertos) + toNumber(r.erros),
    0
  );

  if (!totalQuestoes) return 0;

  return Math.round((totalAcertos / totalQuestoes) * 100);
};
