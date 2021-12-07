/** importar o módulo do framework express*/
const express = require('express');


/** importando o consing para gerencias os arquivos */
const consign = require('consign');

/**Instanciou o server express*/
const server = express();

/**importar o módulo do body-parser e usando no servidor*/
server.use(require('body-parser').json());

consign()
    .include('controllers')
    .into(server);


server.get('/hello', (req, res) =>{
    console.log("Acessando rota de teste do servidor")
    res.status(200);
    res.send('Olá Mundo!!!');
})

module.exports = server;