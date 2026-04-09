/*******************************************************************************************************************************************
* Objetivo: Desenvolver uma API de Gestão de Folha de Pagamento
* Data: 05/03/2026
* Autor: Jean Costa
* Versão 1.1
********************************************************************************************************************************************/

const express = require('express')
const cors = require('cors')
const funcionarioRoutes = require('./routes/funcionarioRoutes')

const app = express()

const corsOptions = {
    origin: "*",
    methods: "GET", 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true 
}

app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())

//Monta a rota /funcionario
app.use('/funcionario', funcionarioRoutes)

module.exports = app