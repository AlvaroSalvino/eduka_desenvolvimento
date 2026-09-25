export const limparTelefone = (telefone) => {
  if (!telefone) return '';
  return telefone.replace(/\D/g, '').slice(0, 11);
};

export const formatarTelefone = (value) => {
  if (!value) return '';

  let digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits;

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d+)/, '$1-$2');
  }

  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d+)/, '$1-$2');
};

export const validarTelefone = (telefone) => {
  const cleaned = limparTelefone(telefone);
  return cleaned.length === 10 || cleaned.length === 11;
};