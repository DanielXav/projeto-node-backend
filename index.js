/** Importa as configurações do servidor */
const server = require('./config/server');

/**Importa as configurações do banco de dados*/
const db = require('./config/banco');
db.DB;

server.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});