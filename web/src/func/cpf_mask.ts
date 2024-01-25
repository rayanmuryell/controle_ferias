export const formatarCPF = (cpf: string | undefined): string => {
  if (!cpf) {
    return ''; // ou outro valor padrão se preferir
  }

  // Remove qualquer caractere que não seja número
  const numerosCpf = cpf.replace(/\D/g, '');

  // Adiciona os pontos e o traço ao CPF
  return numerosCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
