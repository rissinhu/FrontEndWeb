function executar(evento) {

    evento.preventDefault();

    limparForm();

    if (!validarForm()) {
        return;
    }

    salvarCadastro();

    chamarApi();

}

function salvarCadastro() {

    const dados = {
        nome: document.querySelector("#nome").value.trim(),
        idade: Number(document.querySelector("#idade").value),
        celular: document.querySelector("#celular").value,
        email: document.querySelector("#email").value.trim()
    };

    localStorage.setItem("cadastro", JSON.stringify(dados));

}

function carregarCadastro() {

    const dadosSalvos = localStorage.getItem("cadastro");

    if (dadosSalvos) {

        const dados = JSON.parse(dadosSalvos);

        document.querySelector("#nome").value = dados.nome;
        document.querySelector("#idade").value = dados.idade;
        document.querySelector("#celular").value = dados.celular;
        document.querySelector("#email").value = dados.email;

    }

}

async function chamarApi() {

    const dados = {
        nome: document.querySelector("#nome").value.trim(),
        idade: Number(document.querySelector("#idade").value),
        celular: document
            .querySelector("#celular")
            .value.replace(/\D/g, "")
            .slice(0, 11),
        email: document.querySelector("#email").value.trim()
    };

    try {

        const resposta = await fetch(
            "https://postman-echo.com/post",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            }
        );

        if (!resposta.ok) {
            throw new Error(
                `Erro ${resposta.status}: ${resposta.statusText}`
            );
        }

        const resultado = await resposta.json();

        alert(
            `Cadastro realizado com sucesso, ${resultado.json.email}!`
        );

    } catch (erro) {

        alert(
            "Cadastro salvo no navegador, mas não foi possível enviar para a API: "
            + erro.message
        );

    }

}

function validarForm() {

    let valido = true;

    const nome = document.querySelector("#nome").value.trim();
    const idade = document.querySelector("#idade").value;
    const celular = document
        .querySelector("#celular")
        .value.replace(/\D/g, "");
    const email = document.querySelector("#email").value.trim();
    const termos = document.querySelector("#termos").checked;

    if (nome === "") {

        mostrarErro("erro-nome", "Nome não pode estar vazio!");
        valido = false;

    }

    if (idade === "") {

        mostrarErro("erro-idade", "Idade não pode estar vazia!");
        valido = false;

    } else if (Number(idade) < 18 || Number(idade) > 120) {

        mostrarErro("erro-idade", "Informe uma idade entre 18 e 120 anos!");
        valido = false;

    }

    if (celular.length !== 11) {

        mostrarErro(
            "erro-celular",
            "Informe um celular com DDD e 11 números!"
        );

        valido = false;

    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {

        mostrarErro("erro-email", "Informe um email válido!");
        valido = false;

    }

    if (!termos) {

        mostrarErro(
            "erro-termos",
            "É preciso aceitar os termos!"
        );

        valido = false;

    }

    const concluido = document.querySelector("#concluido");

    if (!valido) {

        concluido.textContent = "Corrija os erros antes de prosseguir!";
        concluido.classList.add("erro");
        concluido.classList.remove("oculto");

    }

    return valido;

}

function mostrarErro(id, mensagem) {

    const campoErro = document.querySelector(`#${id}`);

    campoErro.textContent = mensagem;
    campoErro.classList.add("erro");
    campoErro.classList.remove("oculto");

}

function limparForm() {

    document.querySelectorAll("form p").forEach((item) => {

        item.textContent = "";
        item.classList.remove("erro", "sucesso");
        item.classList.add("oculto");

    });

}

function mascararCelular(evento) {

    const campo = evento.target;

    const numeros = campo.value.replace(/\D/g, "").slice(0, 11);

    const ddd = numeros.slice(0, 2);
    const inicio = numeros.slice(2, 7);
    const fim = numeros.slice(7);

    if (numeros.length > 7) {

        campo.value = `(${ddd}) ${inicio}-${fim}`;

    } else if (numeros.length > 2) {

        campo.value = `(${ddd}) ${inicio}`;

    } else if (numeros.length > 0) {

        campo.value = `(${ddd}`;

    } else {

        campo.value = "";

    }

}

carregarCadastro();