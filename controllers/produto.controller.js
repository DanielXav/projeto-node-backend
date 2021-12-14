const banco = require('../config/banco');

module.exports = server => {
    const urlBase = `/produtos`;

    // Cadastrar um novo 
    server.post(`${urlBase}/cadastrar`, (req, res) => {
        console.log("Novo carro sendo cadastrado: ", req.body.placa, req.body.valor, req.body.horaEntrada, req.body.horaSaida);

        const sql = `INSERT INTO produtos(placa, valor, horaEntrada, horaSaida) VALUES(?,?,?,?)`;

        banco.DB.run(sql, [req.body.placa, req.body.valor, req.body.horaEntrada, req.body.horaSaida], (err) => {
            if (err) {
                console.log(err.message);
                res.send("Error ao inserir registro");
                res.status(500);
            }
            console.log("Novo carro adicionado");
            res.status(201);
            res.send("Novo carro cadastrado com sucesso: " + req.body.placa);
        });
    });

    // Listar todos os carros do banco
    server.get(`${urlBase}/listar`, (req, res) => {

        const sql = `SELECT id, placa, valor, horaEntrada, horaSaida FROM produtos 
                      ORDER BY id`;

        banco.DB.all(sql, [], (err, rows) => {
            if (err) {
                res.send("Error ao listar todos os carros");
                res.status(500);
                throw err;
            }
            console.log("Carros localizados");
            res.status(200);
            res.send(rows);
        });
    });

    // Listar pod id
    server.get(`${urlBase}/listar/:id`, (req, res) => {

        const sql = `SELECT placa, valor, horaEntrada, horaSaida FROM produtos 
                     WHERE id = ?`;

        banco.DB.each(sql, [req.params.id], (err, row) => {
            if (err) {
                res.send("Error ao listar o carro");
                res.status(500);
                throw err;
            }
            console.log("Carro localizado");
            res.status(200);
            res.send(row);
        });
    });

    // Listar pela placa
    server.get(`${urlBase}/listar/:placa`, (req, res) => {

        const sql =  `SELECT id, valor, horaEntrada, horaSaida FROM produtos 
                    WHERE placa = ?`;

        banco.DB.each(sql, [req.params.placa], (err, row) => {
            if (err) {
                res.send("Error ao listar o carro");
                res.status(500);
                throw err;
            }
            console.log("Carro localizado");
            res.status(200);
            res.send(row);
        });
    })

    //Mostrar o total recebido
    server.get(`${urlBase}/total`, (req, res) => {

        const sql =  `SELECT SUM(valor) AS total FROM produtos`;

        banco.DB.all(sql, [req.params.valor], (err, row) => {
            if (err) {
                res.send("Error ao mostrar o total recebido");
                res.status(500);
                throw err;
            }
            console.log("Total recebido: ");
            res.status(200);
            res.send(row);
        });
    })

    // Atualizar por id
    server.patch(`${urlBase}/atualizar/:id`, (req, res, next) => {
        var data = {
            placa: req.body.placa,
            valor: req.body.valor,
            horaEntrada: req.body.horaEntrada,
            horaSaida: req.body.horaSaida
        }
        banco.DB.run(
            `UPDATE produtos set 
               placa = COALESCE(?,placa), 
               valor = COALESCE(?,valor), 
               horaEntrada = COALESCE(?,horaEntrada),
               horaSaida = COALESCE(?,horaSaida) 
               WHERE id = ?`,
            [data.placa, data.valor, data.horaEntrada, data.horaSaida, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({
                    message: "Carro atualizado com sucesso",
                    data: data,
                    changes: this.changes
                })
        });
    })
    
    // Deletar um carro
    server.delete(`${urlBase}/remover/:id`, (req, res) => {

        const sql = `DELETE FROM
        produtos
        WHERE
        id = ?`;

        banco.DB.run(sql, [req.params.id], function (err) {
            if (err) {
                res.send("Error ao remover o produto");
                res.status(500);
                console.error(err.message);
            }
            console.log(`Produto removido`);
            res.send(`Produto removido`);
        });
    });
}