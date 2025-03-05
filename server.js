const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar banco de dados
const sequelize = require("./src/config/database");

// Testar conexão com o banco
sequelize
  .authenticate()
  .then(() => console.log("Conexão com MySQL estabelecida com sucesso."))
  .catch((err) => console.error("Erro ao conectar ao MySQL:", err));

// Sincronizar modelos com o banco
sequelize
  .sync()
  .then(() => console.log("Modelos sincronizados com o banco de dados"))
  .catch((err) => console.error("Erro ao sincronizar modelos:", err));

// Importar rotas
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const movieRoutes = require("./src/routes/movie.routes");
const watchlistRoutes = require("./src/routes/watchlist.routes");

// Usar rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.send("API TrackFilmes funcionando!");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
