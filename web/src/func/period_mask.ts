export const formatarPeriodo = (periodo: string): string => {
  const numerosPeriodo = periodo.replace(/\D/g, '');
  return numerosPeriodo.replace(/(\d{4})(\d{4})/, '$1 - $2');
};