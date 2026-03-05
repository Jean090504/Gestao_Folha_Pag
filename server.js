/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por armazenar local do meu servidor
* Data: 05/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

const app = require('./src/app');
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado em: http://localhost:${PORT}`)
})