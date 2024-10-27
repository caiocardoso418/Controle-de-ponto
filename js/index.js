// Exibição contínua da data e hora
const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");

function getWeekDay() {
    const date = new Date();
    const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[date.getDay()];
}

function getCurrentHour() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

function getCurrentDate() {
    const date = new Date();
    return String(date.getDate()).padStart(2, '0') + "/" + String(date.getMonth() + 1).padStart(2, '0') + "/" + date.getFullYear();
}

function printCurrentHour() {
    horaMinSeg.textContent = getCurrentHour();
    diaSemana.textContent = getWeekDay();
    diaMesAno.textContent = getCurrentDate();
}

// Atualiza a hora a cada segundo
setInterval(printCurrentHour, 1000);

// Botão "Bater ponto"
document.getElementById("btn-bater-ponto")?.addEventListener("click", () => {
    document.getElementById("dialog-ponto").showModal();
});

// Botão para fechar o diálogo de ponto
document.getElementById("btn-dialog-fechar")?.addEventListener("click", () => {
    document.getElementById("dialog-ponto").close();
});

// Botão "Bater ponto antigo"
document.getElementById("btn-bater-ponto-antigo")?.addEventListener("click", () => {
    document.getElementById("dialog-ponto-antigo").showModal();
});

document.getElementById("btn-dialog-fechar-antigo")?.addEventListener("click", () => {
    document.getElementById("dialog-ponto-antigo").close();
});

// Justificativa de ausência
document.getElementById("btn-abrir-justificativa")?.addEventListener("click", () => {
    document.getElementById("dialog-justificativa").showModal();
});

document.getElementById("btn-fechar-justificativa")?.addEventListener("click", () => {
    document.getElementById("dialog-justificativa").close();
});

// Salvar ponto
document.getElementById("btn-dialog-bater-ponto")?.addEventListener("click", () => {
    const typeRegister = document.getElementById("tipos-ponto").value;
    const observacao = document.getElementById("observacao-registro").value;
    
    const ponto = {
        data: getCurrentDate(),
        hora: getCurrentHour(),
        tipo: typeRegister,
        observacao: observacao || ""
    };

    saveRegisterLocalStorage(ponto);
    document.getElementById("dialog-ponto").close();
    alert("Ponto registrado com sucesso!");
});

// Salvar ponto antigo
document.getElementById("btn-dialog-bater-ponto-antigo")?.addEventListener("click", () => {
    const dataPontoAntigo = document.getElementById("data-antigo").value;
    const observacaoAntigo = document.getElementById("observacao-ponto-antigo").value;
    const dataAtual = new Date();
    
    if (!dataPontoAntigo || new Date(dataPontoAntigo) > dataAtual) {
        alert("Data inválida. Por favor, selecione uma data válida.");
        return;
    }

    const pontoAntigo = {
        data: dataPontoAntigo,
        hora: getCurrentHour(),
        tipo: "ponto antigo",
        observacao: observacaoAntigo || ""
    };

    saveRegisterLocalStorage(pontoAntigo);
    document.getElementById("dialog-ponto-antigo").close();
    alert("Ponto antigo registrado com sucesso!");
    gerarRelatorio();
});

// Salvar justificativa
document.getElementById("btn-enviar-justificativa")?.addEventListener("click", () => {
    const justificativa = document.getElementById("justificativa-ausencia").value;
    const arquivo = document.getElementById("upload-arquivo").files[0];

    if (!justificativa || !arquivo) {
        alert("Por favor, forneça uma justificativa e anexe um arquivo.");
        return;
    }

    const justificativaAusencia = {
        data: getCurrentDate(),
        hora: getCurrentHour(),
        justificativa: justificativa,
        arquivo: arquivo.name
    };

    const justificativas = JSON.parse(localStorage.getItem("justificativas")) || [];
    justificativas.push(justificativaAusencia);
    localStorage.setItem("justificativas", JSON.stringify(justificativas));

    document.getElementById("dialog-justificativa").close();
    alert("Justificativa registrada com sucesso!");
    gerarRelatorioJustificativas();
});

// Função para salvar registro no LocalStorage
function saveRegisterLocalStorage(register) {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    registros.push(register);
    localStorage.setItem("register", JSON.stringify(registros));
}

// Referências aos elementos de botão e relatório
const btnToggleRelatorio = document.getElementById("btn-toggle-relatorio");
const secaoRelatorio = document.getElementById("secao-relatorio");

// Evento para mostrar ou ocultar o relatório junto com os botões de filtro
btnToggleRelatorio?.addEventListener("click", () => {
    if (secaoRelatorio.style.display === "none" || secaoRelatorio.style.display === "") {
        secaoRelatorio.style.display = "block"; // Exibe a seção do relatório
        gerarRelatorio(); // Gera o relatório ao exibir
        btnToggleRelatorio.textContent = "Ocultar Relatório de Registros";
    } else {
        secaoRelatorio.style.display = "none"; // Oculta a seção do relatório
        btnToggleRelatorio.textContent = "Ver Relatório de Registros";
    }
});


// Função para gerar o relatório de registros
function gerarRelatorio() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    relatorioDiv.innerHTML = registros.map(reg => `
        <div class="registro ${reg.observacao ? 'observacao' : ''}">
            <p>Data: ${reg.data} - Hora: ${reg.hora} - Tipo: ${reg.tipo}</p>
            <p>Observação: ${reg.observacao || "Sem observação"}</p>
        </div>
    `).join("");
}

// Função para gerar o relatório de registros com botões de edição e exclusão
function gerarRelatorio() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const relatorioDiv = document.getElementById("relatorio");

    relatorioDiv.innerHTML = registros.map((reg, index) => `
        <div class="registro ${reg.observacao ? 'observacao' : ''}">
            <p>Data: ${reg.data} - Hora: ${reg.hora} - Tipo: ${reg.tipo}</p>
            <p>Observação: ${reg.observacao || "Sem observação"}</p>
            <button onclick="editarRegistro(${index})">Editar</button>
            <button onclick="excluirRegistro()">Excluir</button>
        </div>
    `).join("");
}

// Função para exibir um alerta ao tentar excluir
function excluirRegistro() {
    alert("Este ponto não pode ser excluído.");
}

// Função para editar um registro
function editarRegistro(index) {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registro = registros[index];
    
    const novaObservacao = prompt("Edite a observação:", registro.observacao);
    
    if (novaObservacao !== null) { // Se o usuário não cancelar
        registros[index].observacao = novaObservacao;
        localStorage.setItem("register", JSON.stringify(registros)); // Atualiza o registro no localStorage
        gerarRelatorio(); // Atualiza o relatório para refletir a edição
        alert("Observação atualizada com sucesso!");
    }
}

// Função para calcular a data de corte para o filtro
function calcularDataCorte(periodo) {
    const hoje = new Date();
    if (periodo === 'ultimaSemana') {
        hoje.setDate(hoje.getDate() - 7);
    } else if (periodo === 'ultimoMes') {
        hoje.setMonth(hoje.getMonth() - 1);
    }
    return hoje;
}

// Função para filtrar os registros com base no período
function filtrarRegistros(periodo) {
    const dataCorte = calcularDataCorte(periodo); // Data de corte baseada no período
    const registros = JSON.parse(localStorage.getItem("register")) || [];

    // Filtra os registros com data igual ou posterior à data de corte
    const registrosFiltrados = registros.filter(reg => {
        const [dia, mes, ano] = reg.data.split("/").map(Number);
        const dataRegistro = new Date(ano, mes - 1, dia);
        return dataRegistro >= dataCorte;
    });

    gerarRelatorioFiltrado(registrosFiltrados);
}

// Função para gerar o relatório filtrado
function gerarRelatorioFiltrado(registros) {
    const relatorioDiv = document.getElementById("relatorio");

    relatorioDiv.innerHTML = registros.map((reg, index) => `
        <div class="registro ${reg.observacao ? 'observacao' : ''}">
            <p>Data: ${reg.data} - Hora: ${reg.hora} - Tipo: ${reg.tipo}</p>
            <p>Observação: ${reg.observacao || "Sem observação"}</p>
            <button onclick="editarRegistro(${index})">Editar</button>
            <button onclick="excluirRegistro()">Excluir</button>
        </div>
    `).join("");
}

// Inicialização ao carregar a página
window.onload = () => {
    printCurrentHour();
    gerarRelatorio();
    gerarRelatorioJustificativas();
};



