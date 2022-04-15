/* Perguntar no nome do usuário */
let statusCode = 0;
let deuCerto = [];
function entrarNaSala() {
  const nome = prompt(`Bem-vindo ao Bate-papo UOL!\nQual o seu nome?`);
  const usuario = { name: nome }
  statusCode = 0;
  axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario)
  .then(conexaoAceita)
  .catch(falha)
}

function conexaoAceita(resposta) {
  console.log(resposta);
}

function falha(erro) {
  statusCode = erro.response.status;
  if (statusCode === 400) {
    entrarNaSala();
  }
}

entrarNaSala();
