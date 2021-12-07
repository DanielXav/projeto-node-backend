const sqlite3 = require('sqlite3').verbose();

/**Criação do banco de dados*/
const db = new sqlite3.Database('./banco.db', (err) => { 
    if (err) { 
        console.log('Error ao criar bando de dados', err);
    } else { 
        console.log('Banco de  dados criado');
        createTable();
    } 
});

const createTable = () => {
    console.log("Criando table produtos");
    db.run("CREATE TABLE IF NOT EXISTS produtos(id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, valor NUMBER)", (err)=>{
        if(err){
            console.log("Error ao criar tabela",err);
        }else{
            console.log("Tabela criada com sucesso.");
        }
    });
}

const close = () =>{
    db.close();
}

module.exports = {
    DB:db,
    createTable,
    close
};