/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por controlar cálculos de INSS/IRRF e persistêcia no JSON/CSV
* Data: 05/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

const fs = require('fs')
let bancoDeDados = []

//Carrega os dados assim que o servidor iniciar
if(fs.existsSync('./FolhaDePagamento.json')){
    const dados = fs.readFileSync('./FolhaDePagamento.json', 'utf-8')
    bancoDeDados = JSON.parse(dados)
    console.log(`Sucesso: Banco de dados carregado.`)
}

const salvar = () => fs.writeFileSync('./FolhaDePagamento.json', JSON.stringify(bancoDeDados, null, 2))

exports.listarTodos = (req, res) => res.json(bancoDeDados)

exports.buscar = (req, res) => {
    const nome = req.query.nome?.trim().toLowerCase() || ''
    const resultados = bancoDeDados.filter(f => f.nome.toLowerCase().includes(nome))
    res.json(resultados.length ? resultados : {mensagem: 'ERRO: Nenhum funcionário encontrado!!'})
}

exports.cadastrar = (req, res) => {
    //Novo cadastro
    const novo = req.body
    novo.id = Math.floor(Math.random() * 1000) + 1

    //Cálculo de Folha de Pagamento
    const sb = novo.salarioBase
    const inss = sb * 0.10
    const baseIRRF = sb - inss

    let irrf = baseIRRF > 5000 ? baseIRRF * 0.275: (
        baseIRRF> 2500 ? baseIRRF * 0.15 : 0
    )

    novo.inss = inss
    novo.irrf = Number(irrf).toFixed(2)
    novo.salarioLiquido = sb - inss - irrf

    //Salva no arquivo de json
    bancoDeDados.push(novo)
    salvar()
    res.json({mensagem: 'Sucesso: Funcionário cadastrado com sucesso!!!', dados: novo})
}

//Procura se no arquivo json existe aquele id, e se retornar ele é deletado
exports.deletar = (req, res) => {
    const id = Number(req.params.id)
    const index = bancoDeDados.findIndex(f => f && f.id === id)
    if(index === -1) return res.status(404).json({mensagem: 'ERRO: Funcionário não encontrado'})

    bancoDeDados.splice(index, 1)
    salvar()
    res.json({mensagem: 'Sucesso: Funcionário deletado com sucesso!!!'})
}

exports.exportarCSV = (req, res) => {
    const header = "ID;Nome;Cargo;Salário Base;INSS;IRRF;Salário Líquido\n";
    const linhas = bancoDeDados.map(f => `${f.id};${f.nome};${f.cargo};${f.salarioBase};${f.inss};${f.irrf};${f.salarioLiquido}`).join('\n');
    fs.writeFileSync('./FolhaDePagamento.csv', header + linhas);
    res.json({ mensagem: "CSV gerado!" });
}