export const formatarData = (data: string | undefined): string => {
  if (!data) {
    return ''; // ou outro valor padrão se preferir
  }

  const dataObj = new Date(data);
  const ano = String(dataObj.getFullYear());
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês é base 0
  const dia = String(dataObj.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
};
