export const limparCep = (cep) => {
  if (!cep) return '';
  return cep.replace(/\D/g, '').slice(0, 8);
};

export const formatarCep = (value) => {
  if (!value) return '';

  let digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 5) return digits;

  return digits.replace(/^(\d{5})(\d+)/, '$1-$2');
};

export const buscarCep = async (cep) => {
  const cleaned = limparCep(cep);

  if (cleaned.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    const data = await response.json();

    if (data.erro) return null;

    return {
      cep: data.cep,
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      complemento: data.complemento,
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};