//Variáveis globais
let statusCode = 0;
let usuarioConectado = '';
let carregamento = 1;

/*                          Entrando na sala do chat                      */
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
  //Atualiza as mensagens depois que o usuário entra
  carregarMensagens();

  /* Pegando o nome do usuário na resposta da requisição (que vem em JSON),
     convertendo para objeto e pegando apena o valor
  */
  statusCode = resposta.status;
  usuarioConectado = JSON.parse(resposta.config.data).name;

  /* Atualizando o status de conectado do usuário a cada 4s */
  function manterOnline() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: usuarioConectado });
  }
  setInterval(manterOnline, 4500);
}

function falhaNaConexao() {
  //Pega o status code do erro e verifica se foi por nome já existente
  if (statusCode !== 200) {
    entrarNaSala();
  }
}

/*                    Listando as mensagens do servidor                   */
function carregarMensagens() {
  axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
  .then(listarMensagens);

  function listarMensagens(lista) {
    //selecionando a div que mostrará todas as mensagens
    let conversa = document.querySelector(".mensagens");
    const listaDeMensagens = lista.data;
    conversa.innerHTML = '';
    listaDeMensagens.map(mostrarMensagens);
    
    function mostrarMensagens(mensagem) {
      //Mensagens de status
      if (mensagem.type === 'status') {
        conversa.innerHTML+=`
        <li class="conteiner-mensagem status-login">
          <div class="mensagem">
            <span class="hora">${mensagem.time}</span>
            <span class="usuario">${mensagem.from}</span>
            ${mensagem.text} 
          </div>
        </li>`
      }

      //Mensagens de texto
      else if(mensagem.type === 'message'){
        conversa.innerHTML+=`
        <li class="conteiner-mensagem">
          <div class="mensagem">
            <span class="hora">${mensagem.time}</span>
            <span class="usuario">${mensagem.from}</span>
            para <span class="usuario">${mensagem.to}</span>:
            ${mensagem.text}
          </div>
        </li>`
      }

      //Mensagens privadas
      else if(mensagem.type === "private_message" && mensagem.from === usuarioConectado){
        conversa.innerHTML+=`
        <li class="conteiner-mensagem">
          <div class="mensagem private">
            <span class="hora">${mensagem.time}</span>
            <span class="usuario">${mensagem.from}</span>
            reservadamente para <span class="usuario">${mensagem.to}</span>:
            ${mensagem.text}
          </div>
        </li>`
      }
    }
    // Obtém o último <li> pertencente a estrutura <ul> obtida
    const ultimaMensagem = conversa.lastChild;
    ultimaMensagem.scrollIntoView();
  }
}

function gerenciador() {
    //Se estiver no primeiro carregamento da página, pergunta o nome do usuário
    if (carregamento === 1) {
      carregamento++;
      carregarMensagens();
      setTimeout(entrarNaSala, 1000); 
    }
    else{
      carregarMensagens();
    }
}

/*                  Enviando as mensagens para o servidor                 */
function enviarMensagem() {
  //Recebendo o texto do input
  const mensagem = document.querySelector(".texto-mensagem").value;
  //Requisitando o envio da mensagem para o servidor
  axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",({
    from: usuarioConectado,
    to: "Todos",
    text: mensagem,
    type: "message"
  }))
  .then(enviar) //caso dê certo
  .catch(erroDeEnvio) //caso de erro

  //Se enviar a mensagem com sucesso, atualiza as mensagens na aplicação
  function enviar() {
    //Limpa o input para possibilitar o envio de novas mensagens
    document.querySelector(".texto-mensagem").value = '';
    carregarMensagens();
  }
  
  //Se falhar ao enviar a mensagem, atualiza a página para logar novamente
  function erroDeEnvio() {
    window.location.reload();
  }

}

//Inicia a aplicação carregando as mensagens
gerenciador();
setInterval(carregarMensagens,3000);