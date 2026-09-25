export const limparCnpj = (cnpj) => {
  if (!cnpj) return '';
  return cnpj.replace(/\D/g, '').slice(0, 14);
};

export const formatarCnpj = (value) => {
  if (!value) return '';

  let digits = value.replace(/\D/g, '').slice(0, 14);

  digits = digits.replace(/^(\d{2})(\d)/, '$1.$2');
  digits = digits.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  digits = digits.replace(/\.(\d{3})(\d)/, '.$1/$2');
  digits = digits.replace(/(\d{4})(\d)/, '$1-$2');

  return digits;
};