/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir as rotas da API
* Data: 05/03/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

const express = require('express')
const router = express.Router()
const controller = require('../controllers/funcionarioController')

router.get('/', controller.listarTodos)
router.get('/buscar', controller.buscar)
router.get('/exportar-csv', controller.exportarCSV)
router.post('/', controller.cadastrar)
router.delete('/:id', controller.deletar)

module.exports = router
