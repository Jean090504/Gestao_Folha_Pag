/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por armazenar a lógica dentro do html
* Data: 05/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

'use strict'

const API_URL = 'https://folha-de-pagamento.onrender.com/funcionarios'

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema iniciado: Carregando dados...")
    carregarFuncionarios()
})

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

//FUNÇÃO AUXILIAR: CRIA O ELEMENTO DO CARD 
function criarCardFuncionario(f) {
    const card = document.createElement('div')
    card.className = "border p-4 rounded-lg bg-gray-50 flex justify-between items-center shadow-sm hover:shadow-md transition"

    // Aqui usamos innerHTML apenas para o CONTEÚDO do novo card
    card.innerHTML = `
        <div>
            <p class="font-bold text-lg text-gray-800">${f.nome} <span class="text-xs font-normal text-gray-400">(ID: ${f.id})</span></p>
            <p class="text-gray-600 text-sm italic">${f.cargo}</p>
            <div class="mt-2 text-sm">
                <span class="text-green-600 font-bold">Líquido: ${formatarMoeda(f.salarioLiquido)}</span>
                <span class="ml-4 text-gray-400 font-medium">INSS: ${formatarMoeda(f.inss)}</span>
            </div>
        </div>
        <div class="flex gap-2">
            <button onclick="prepararEdicao(${f.id})" class="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition font-bold">Editar</button>
            <button onclick="deletar(${f.id})" class="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition font-bold">Excluir</button>
        </div>
    `
    return card
}

// CARREGA LISTA
async function carregarFuncionarios() {
    try {
        const response = await fetch(API_URL)
        const funcionarios = await response.json()
        const container = document.getElementById('lista')
        
        container.innerHTML = '' // Limpa apenas uma vez no início

        if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">Nenhum funcionário encontrado.</p>'
            return
        }

        // Criamos um fragmento para otimizar ainda mais a inserção
        const fragmento = document.createDocumentFragment()
        
        funcionarios.forEach(f => {
            const novoCard = criarCardFuncionario(f)
            fragmento.appendChild(novoCard)
        })

        container.appendChild(fragmento)
    } catch (error) {
        console.error("Erro ao carregar lista: ", error)
    }
}

//BUSCA EM TEMPO REAL 
async function buscarFuncionarios() {
    const nomeBusca = document.getElementById('inputBusca').value.trim()
    const container = document.getElementById('lista')

    if(nomeBusca == '') {
        carregarFuncionarios()
        return
    }   

    try {
        const response = await fetch(`${API_URL}/buscar?nome=${nomeBusca}`)
        const resultado = await response.json()

        container.innerHTML = ''

        if(resultado.mensagem) {
            container.innerHTML = `<div class="text-center py-8"> <p class="text-gray-500 font-medium">${resultado.mensagem}</p> </div>`
            return
        }

        const fragmento = document.createDocumentFragment()
        resultado.forEach(f => {
            fragmento.appendChild(criarCardFuncionario(f))
        })
        container.appendChild(fragmento)

    } catch (error) {
        console.error("Erro ao buscar:", error)
    }
}

// CADASTRAR (POST)
async function cadastrar() {
    const nome = document.getElementById('nome').value
    const cargo = document.getElementById('cargo').value
    const salario = document.getElementById('salario').value

    if(!nome || !cargo || !salario) return alert('ERRO: Preencha todos os campos!!')

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({ nome, cargo, salarioBase: Number(salario) })
        })
        
        // Limpa os campos após cadastrar
        document.getElementById('nome').value = ''
        document.getElementById('cargo').value = ''
        document.getElementById('salario').value = ''
        
        carregarFuncionarios()
    } catch(error) {
        console.error('ERRO: Problema ao cadastrar: ', error)
    }
}

// DELETAR (DELETE)
async function deletar(id) {
    if (confirm("Deseja realmente excluir este funcionário?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            carregarFuncionarios()
        } catch (error) {
            console.error("Erro na comunicação com a API:", error)
        }
    } 
}

// LÓGICA DO MODAL (PUT)
async function prepararEdicao(id) {
    // Busca os dados atuais para preencher o modal
    const response = await fetch(API_URL)
    const funcionarios = await response.json()
    const f = funcionarios.find(item => item.id === id)

    if (f) {
        document.getElementById('idEditar').value = f.id
        document.getElementById('nomeEditar').value = f.nome
        document.getElementById('cargoEditar').value = f.cargo
        document.getElementById('salarioEditar').value = f.salarioBase
        
        document.getElementById('modalEditar').classList.remove('hidden')
    }
}

//Fecha a tela de edição
function fecharModal() {
    document.getElementById('modalEditar').classList.add('hidden')
}

//Salva as alterações e envia para o banco
async function salvarEdicao() {
    const id = document.getElementById('idEditar').value
    const nome = document.getElementById('nomeEditar').value
    const cargo = document.getElementById('cargoEditar').value
    const salarioBase = document.getElementById('salarioEditar').value

    if (!nome || !cargo || !salarioBase) return alert("Preencha todos os campos!")

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nome,
                cargo: cargo,
                salarioBase: Number(salarioBase)
            })
        })

        if (response.ok) {
            fecharModal()
            carregarFuncionarios()
        }
    } catch (error) {
        console.error("Erro ao atualizar:", error)
    }
}

// BUSCA EM TEMPO REAL
async function buscarFuncionarios() {
    const nomeBusca = document.getElementById('inputBusca').value.trim()
    const container = document.getElementById('lista')

    //Se o campo estiver vazio, carrega a lista novamente
    if(nomeBusca == ''){
        carregarFuncionarios()
        return
    }   

    try{
        //Fazendo requisição usando Query Params (?nome=...)
        const response = await fetch (`${API_URL}/buscar?nome=${nomeBusca}`)
        const resultado = await response.json()

        container.innerHTML = ''

        //Retorna um objeto com mensagem de erro se não achar nada
        if(resultado.mensagem){
            container.innerHTML = `<div class="text-center py-8"> <p class="text-gray-500 font-medium">${resultado.mensagem}</p> </div>`
            return
        }

    // Se achar o funcionário vai desenhar o card
        resultado.forEach(f => {
            container.innerHTML += `
                <div class="border p-4 rounded-lg bg-gray-50 flex justify-between items-center shadow-sm hover:shadow-md transition">
                    <div>
                        <p class="font-bold text-lg text-gray-800">${f.nome} <span class="text-xs font-normal text-gray-400">(ID: ${f.id})</span></p>
                        <p class="text-gray-600 text-sm italic">${f.cargo}</p>
                        <div class="mt-2 text-sm">
                            <span class="text-green-600 font-bold">Líquido: ${formatarMoeda(f.salarioLiquido)}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="prepararEdicao(${f.id})" class="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition font-bold">Editar</button>
                        <button onclick="deletar(${f.id})" class="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition font-bold">Excluir</button>
                    </div>
                </div>
            `
        })
    } catch (error) {
        console.error("Erro ao buscar:", error)
    }
}
    