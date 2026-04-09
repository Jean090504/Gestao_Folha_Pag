/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por armazenar local do meu servidor
* Data: 05/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

const app = require('./src/app');

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
})