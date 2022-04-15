/*                          Entrando na sala do chat                      */
let statusCode = 0;
function entrarNaSala() {
  //Pergunta o nome do usuário 
  const nome = prompt(`Bem-vindo ao Bate-papo UOL!\nQual o seu nome?`);
  const usuario = { name: nome };

  //Zera a variável statusCode em caso de uma repetição dessa função
  statusCode = 0;

  //Faz a requisição para colocar o usuário no chat
  axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario)
    .then(conexaoAceita) //se der certo
    .catch(falhaNaConexao) //se der erro
}

/*                     Tratando as respostas do servidor                  */

function conexaoAceita(resposta) {
  /* Pegando o nome do usuário na resposta da requisição (que vem em JSON),
     convertendo para objeto e pegando apena o valor
  */
  const usuarioConectado = JSON.parse(resposta.config.data).name;

  /* Atualizando o status de conectado do usuário a cada 4s */
  function manterOnline() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: usuarioConectado });
  }
  setInterval(manterOnline, 4000);
}

function falhaNaConexao(erro) {
  //Pega o status code do erro e verifica se foi por nome já existente
  statusCode = erro.response.status;
  if (statusCode === 400) {
    entrarNaSala();
  }
}

entrarNaSala();
