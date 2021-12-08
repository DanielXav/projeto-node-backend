const banco = require('../config/banco');

module.exports = server => {
    const urlBase = `/produtos`;

    server.post(`${urlBase}/cadastro`, (req, res) => {
        console.log("Novo carro sendo cadastrado: ", req.body.placa, req.body.valor, req.body.horaEntrada, req.body.horaSaida);

        const sql = `INSERT INTO produtos(placa, valor, horaEntrada, horaSaida) VALUES(?,?,?,?)`;

        banco.DB.run(sql, [req.body.placa, req.body.valor, req.body.horaEntrada, req.body.horaSaida], (err) => {
            if (err) {
                console.log(err.message);
                res.send("Error ao inserir registro");
                res.status(500);
            }
            console.log("Novo produto adicionado");
            res.status(201);
            res.send("Novo carro cadastrado com sucesso: " + req.body.placa);
        });
    });

    server.get(`${urlBase}/listar`, (req, res) => {

        const sql = `SELECT id, nome, valor FROM produtos 
                      ORDER BY id`;

        banco.DB.all(sql, [], (err, rows) => {
            if (err) {
                res.send("Error ao listar todos os produtos");
                res.status(500);
                throw err;
            }
            console.log("Produtos localizados");
            res.status(200);
            res.send(rows);
        });
    });

    server.get(`${urlBase}/listar/:id`, (req, res) => {

        const sql = `SELECT nome, valor FROM produtos 
                     WHERE id = ?`;

        banco.DB.each(sql, [req.params.id], (err, row) => {
            if (err) {
                res.send("Error ao listar o produto");
                res.status(500);
                throw err;
            }
            console.log("Produto localizado");
            res.status(200);
            res.send(row);
        });
    });

    server.put(`${urlBase}/atualizar`, (req, res) => {

        const sql = `UPDATE produtos
                     SET nome = ?, valor = ?
                     WHERE id = ?`;

        banco.DB.run(sql, [req.body.nome, req.body.valor, req.body.id], function (err) {
            if (err) {
                res.send("Error ao atualizar o produto");
                res.status(500);
                console.error(err.message);
            }
            console.log(`Produto atualizado: ${this.changes}`);
            res.status(202);
            res.send(`Produto atualizado`);
        });
    });


    
    server.delete(`${urlBase}/remover/:id`, (req, res) => {

        const sql = `DELETE FROM produtos
                        WHERE id = ?`;

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