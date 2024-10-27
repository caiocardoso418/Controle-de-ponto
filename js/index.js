// TO-DO:
// Organizar código-fonte

const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");

const btnBaterPonto = document.getElementById("btn-bater-ponto");
btnBaterPonto.addEventListener("click", register);

const dialogPonto = document.getElementById("dialog-ponto");

const btnDialogFechar = document.getElementById("btn-dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

const nextRegister = {
    "entrada": "intervalo",
    "intervalo": "volta-intervalo", 
    "volta-intervalo": "saida", 
    "saida": "entrada"
}

let registerLocalStorage = getRegisterLocalStorage();

const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");

const divAlertaRegistroPonto = document.getElementById("alerta-registro-ponto");

diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();


async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
            resolve(userLocation);
        },
        (error) => {
            reject("Erro ao recuperar a localização " + error);
        });
    });
}

// TO-DO:
// Problema: os 5 segundos continuam contando
const btnCloseAlertRegister = document.getElementById("alerta-registro-ponto-fechar");
btnCloseAlertRegister.addEventListener("click", () => {
    divAlertaRegistroPonto.classList.remove("show");
    divAlertaRegistroPonto.classList.add("hidden");
});

const btnDialogBaterPonto = document.getElementById("btn-dialog-bater-ponto");
btnDialogBaterPonto.addEventListener("click", async () => {
    const typeRegister = document.getElementById("tipos-ponto").value;
    const observacaoRegistro = document.getElementById("observacao-registro").value; // Captura a observação
    
    let userCurrentPosition = await getCurrentPosition();

    let ponto = {
        "data": getCurrentDate(),
        "hora": getCurrentHour(),
        "localizacao": userCurrentPosition,
        "id": registerLocalStorage.length + 1,
        "tipo": typeRegister,
        "observacao": observacaoRegistro || "" // Armazena a observação
    };

    saveRegisterLocalStorage(ponto);

    dialogPonto.close();

    // Mostra a confirmação
    divAlertaRegistroPonto.classList.remove("hidden");
    divAlertaRegistroPonto.classList.add("show");

    setTimeout(() => {
        divAlertaRegistroPonto.classList.remove("show");
        divAlertaRegistroPonto.classList.add("hidden");
    }, 5000);
});

// Atualiza a função de salvar registro para incluir observação
function saveRegisterLocalStorage(register) {
    registerLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registerLocalStorage));
    localStorage.setItem("lastTypeRegister", register.tipo);
}


function getRegisterLocalStorage() {
    let registers = localStorage.getItem("register");

    if(!registers) {
        return [];
    }

    return JSON.parse(registers); 
}

// TO-DO:
// alterar o nome da função
function register() {
    dialogData.textContent = "Data: " + getCurrentDate();
    dialogHora.textContent = "Hora: " + getCurrentHour();
    
    let lastTypeRegister = localStorage.getItem("lastTypeRegister");
    if(lastTypeRegister) {
        const typeRegister   = document.getElementById("tipos-ponto");
        typeRegister.value   = nextRegister[lastTypeRegister];
        let lastRegisterText = "Último registro: " + localStorage.getItem("lastDateRegister") + " - " + localStorage.getItem("lastTimeRegister") + " | " + localStorage.getItem("lastTypeRegister")
        document.getElementById("dialog-last-register").textContent = lastRegisterText;
    }

    // TO-DO
    // Como "matar" o intervalo a cada vez que o dialog é fechado?
    setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrentHour();
    }, 1000);

    dialogPonto.showModal();
}

function getWeekDay() {
    const date = new Date();
    let days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[date.getDay()];
}

function getCurrentHour() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

function getCurrentDate() {
    const date = new Date();
    return String(date.getDate()).padStart(2, '0') + "/" + String((date.getMonth() + 1)).padStart(2, '0') + "/" + String(date.getFullYear()).padStart(2, '0');
}

function printCurrentHour() {
    horaMinSeg.textContent = getCurrentHour();
}

const btnBaterPontoAntigo = document.getElementById("btn-bater-ponto-antigo");
const dialogPontoAntigo = document.getElementById("dialog-ponto-antigo");
const btnDialogFecharAntigo = document.getElementById("btn-dialog-fechar-antigo");
const btnDialogBaterPontoAntigo = document.getElementById("btn-dialog-bater-ponto-antigo");

btnBaterPontoAntigo.addEventListener("click", () => {
    dialogPontoAntigo.showModal();
});

btnDialogFecharAntigo.addEventListener("click", () => {
    dialogPontoAntigo.close();
});

btnDialogBaterPontoAntigo.addEventListener("click", () => {
    const dataPontoAntigo = document.getElementById("data-antigo").value;
    const observacaoAntigo = document.getElementById("observacao-ponto-antigo").value;
    const dataAtual = new Date(); 
    if (!dataPontoAntigo) {
        alert("Por favor, selecione uma data.");
        return;
    }

    const dataSelecionada = new Date(dataPontoAntigo);

    if (dataSelecionada > dataAtual) {
        alert("Não é permitido registrar um ponto em uma data futura.");
        return;
    }

    let pontoAntigo = {
        "data": dataPontoAntigo,
        "hora": getCurrentHour(), 
        "id": registerLocalStorage.length + 1,
        "tipo": "ponto antigo",
        "observacao": observacaoAntigo || "",
        "isRetroativo": true 
    };

    saveRegisterLocalStorage(pontoAntigo);
    dialogPontoAntigo.close(); 

    alert("Ponto antigo registrado com sucesso!");

   
    gerarRelatorio();
});

function saveRegisterLocalStorage(register) {
    registerLocalStorage.push(register); 
    localStorage.setItem("register", JSON.stringify(registerLocalStorage)); 
}

function gerarRelatorio() {
    const registros = getRegisterLocalStorage(); 
    const relatorioDiv = document.getElementById("relatorio");

    relatorioDiv.innerHTML = ""; 

    registros.forEach(reg => {
        const registroDiv = document.createElement("div");
        registroDiv.classList.add("registro");

        if (reg.isRetroativo) {
            registroDiv.classList.add("retroativo");
        }

        registroDiv.innerHTML = `
            <p>Data: ${reg.data} - Hora: ${reg.hora} - Tipo: ${reg.tipo}</p>
            <p>Observação: ${reg.observacao}</p>
        `;

        relatorioDiv.appendChild(registroDiv);
    });
}

const btnAbrirJustificativa = document.getElementById("btn-abrir-justificativa");
const dialogJustificativa = document.getElementById("dialog-justificativa");
const btnFecharJustificativa = document.getElementById("btn-fechar-justificativa");
const btnEnviarJustificativa = document.getElementById("btn-enviar-justificativa");

// Evento para abrir o diálogo de justificativa
btnAbrirJustificativa.addEventListener("click", () => {
    dialogJustificativa.showModal();
});

// Evento para fechar o diálogo de justificativa
btnFecharJustificativa.addEventListener("click", () => {
    dialogJustificativa.close();
});

// Evento para enviar a justificativa
btnEnviarJustificativa.addEventListener("click", () => {
    const justificativa = document.getElementById("justificativa-ausencia").value;
    const arquivo = document.getElementById("upload-arquivo").files[0]; // Pega o arquivo carregado

    if (!justificativa || !arquivo) {
        alert("Por favor, forneça uma justificativa e anexe um arquivo.");
        return;
    }

    // Salvando a justificativa e o arquivo no LocalStorage (ou backend)
    const justificativaAusencia = {
        "data": getCurrentDate(),
        "hora": getCurrentHour(),
        "justificativa": justificativa,
        "arquivo": arquivo.name // Armazena apenas o nome do arquivo para visualização
    };

    // Adiciona a justificativa ao LocalStorage (poderia ser enviado a um backend)
    let justificativas = JSON.parse(localStorage.getItem("justificativas")) || [];
    justificativas.push(justificativaAusencia);
    localStorage.setItem("justificativas", JSON.stringify(justificativas));

    alert("Justificativa registrada com sucesso!");
    dialogJustificativa.close();
});

function gerarRelatorioJustificativas() {
    const justificativasDiv = document.getElementById("relatorio-justificativas");
    justificativasDiv.innerHTML = ""; // Limpa o conteúdo atual

    const justificativas = JSON.parse(localStorage.getItem("justificativas")) || [];
    
    justificativas.forEach(justif => {
        const justificativaDiv = document.createElement("div");
        justificativaDiv.classList.add("justificativa");
        
        justificativaDiv.innerHTML = `
            <p>Data: ${justif.data} - Hora: ${justif.hora}</p>
            <p>Justificativa: ${justif.justificativa}</p>
            <p>Arquivo: ${justif.arquivo}</p>
        `;

        justificativasDiv.appendChild(justificativaDiv);
    });
}

const btnToggleRelatorio = document.getElementById("btn-toggle-relatorio");
const relatorioDiv = document.getElementById("relatorio");

btnToggleRelatorio.addEventListener("click", () => {
    // Verifica se o relatório está oculto
    if (relatorioDiv.style.display === "none" || relatorioDiv.style.display === "") {
        relatorioDiv.style.display = "block"; // Exibe o relatório
        gerarRelatorio(); // Gera o relatório apenas quando é exibido
        btnToggleRelatorio.textContent = "Ocultar Relatório de Registros";
    } else {
        relatorioDiv.style.display = "none"; // Oculta o relatório
        btnToggleRelatorio.textContent = "Ver Relatório de Registros";
    }
});

// Função para mostrar/ocultar o histórico completo
const btnToggleHistorico = document.getElementById("btn-toggle-historico");
const historicoCompletoDiv = document.getElementById("historico-completo");

btnToggleHistorico.addEventListener("click", () => {
    if (historicoCompletoDiv.style.display === "none") {
        historicoCompletoDiv.style.display = "block";
        gerarHistoricoCompleto();
        btnToggleHistorico.textContent = "Ocultar Histórico Completo";
    } else {
        historicoCompletoDiv.style.display = "none";
        btnToggleHistorico.textContent = "Ver Histórico Completo";
    }
});

// Função para gerar o histórico completo de registros
function gerarHistoricoCompleto() {
    const registrosDiv = document.getElementById("registros");
    registrosDiv.innerHTML = "";

    const registros = getRegisterLocalStorage();
    
    registros.forEach((reg, index) => {
        const registroDiv = document.createElement("div");
        registroDiv.classList.add("registro");
        if (reg.observacao) {
            registroDiv.classList.add("observacao");
        }

        registroDiv.innerHTML = `
            <p><strong>Data:</strong> ${reg.data} - <strong>Hora:</strong> ${reg.hora} - <strong>Tipo:</strong> ${reg.tipo}</p>
            <p><strong>Observação:</strong> ${reg.observacao || "Sem observação"}</p>
            <button onclick="adicionarObservacao(${index})">Adicionar/Editar Observação</button>
        `;
        registrosDiv.appendChild(registroDiv);
    });
}

// Função para adicionar ou editar observação em um registro
function adicionarObservacao(index) {
    const observacao = prompt("Digite uma observação para este registro:");
    if (observacao !== null) {
        let registros = getRegisterLocalStorage();
        registros[index].observacao = observacao;
        localStorage.setItem("register", JSON.stringify(registros));
        gerarHistoricoCompleto();
        alert("Observação adicionada com sucesso!");
    }
}


// Chamar a função para carregar o histórico ao carregar a página
window.onload = () => {
    gerarRelatorio();
    gerarRelatorioJustificativas();
};




printCurrentHour();
setInterval(printCurrentHour, 1000);