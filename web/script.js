/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por armazenar a lógica dentro do html
* Data: 20/02/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/
'use strict'

const API_URL = 'http://localhost:3000/funcionario'

//Testar se o cors está funcionando
async function testarConexao() {
    const status = document.getElementById('statusCORS')

    try{
        const response = await fetch(API_URL)
        if (response.ok) {
            status.innerText = "Sucesso: O CORS permitiu a conexão."
            status.className = "mt-2 text-sm font-medium text-green-600"
            carregarFuncionarios();
        }
    } catch(error){
        status.innerText = 'ERRO: CORS com problema ou API desligada!!'
        status.className = 'mt-2 text-sm font-medium text-red-600'
        console.error('ERRO: Problema na requisição: ', error)
    }
}

//Cadastra um novo usuário (POST)
async function cadastrar() {
    //Pega os valores dos inputs do usuário
    const nome = document.getElementById('nome').value
    const cargo = document.getElementById('cargo').value
    const salario = document.getElementById('salario').value

    if(!nome || !cargo || !salario){
        alert('ERRO: Preencha todos os campos!!')
        return
    }

    const dados = {
        nome: nome,
        cargo: cargo,
        salarioBase: Number(salario)
    }

    try{
        await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body:JSON.stringify(dados)
        })
        alert('Sucesso: Funcionário cadastrado!!')
        carregarFuncionarios()
    } catch(error){
        console.error('ERRO: Problema ao cadastrar: ', error)
    }
}

// Carrega lista de funcionários (GET)
async function carregarFuncionarios() {
    try {
        const response = await fetch(API_URL)
        const funcionarios = await response.json()
        const container = document.getElementById('lista')
        container.innerHTML = ''

        funcionarios.forEach(f => {
            container.innerHTML += `
                <div class="border p-4 rounded-lg bg-gray-50 flex justify-between items-center shadow-sm">
                    <div>
                        <p class="font-bold text-lg text-gray-800">${f.nome} <span class="text-sm font-normal text-gray-500">(ID: ${f.id})</span></p>
                        <p class="text-gray-600 text-sm italic">${f.cargo}</p>
                        <div class="mt-2 text-sm">
                            <span class="text-red-500 font-bold">Líquido: R$ ${f.salarioLiquido}</span>
                            <span class="ml-4 text-gray-400">INSS: R$ ${f.inss}</span>
                        </div>
                    </div>
                    <button onclick="deletar(${f.id})" class="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200">Excluir</button>
                </div>
            `
        })
    } catch (error) {
        console.error("Erro: Problema a carregar lista: ", error)
    }
}

//Deleta funcionário (DELETE)
async function deletar(id) {
    if (confirm("Deseja realmente excluir este funcionário ?")) {
        try {
            const resposta = await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE' 
            })

            // Verificamos se o status da resposta é de sucesso 
            if (resposta.ok) {
                const dados = await resposta.json();
                alert(dados.mensagem || "Sucesso: Funcionário removido com sucesso!!");
                carregarFuncionarios();
            } else {
                // Se o servidor retornar 404 ou 500, caímos aqui
                const erro = await resposta.json();
                alert(`Erro: ${erro.mensagem}`);
            }

        } catch (error) {
            // Erros de rede ou servidor desligado caem aqui
            console.error("Erro: Problema na comunicação com a API:", error);
            alert("ERRO: Não foi possível conectar ao servidor. Verifique se a API está rodando.");
        }
    } 
}