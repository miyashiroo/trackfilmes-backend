const router = require("express").Router();
const movieController = require("../controllers/movie.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Rota de busca - protegida por autenticação
router.get("/search", authMiddleware, movieController.searchMovies);

// Rota para detalhes do filme - protegida por autenticação
router.get("/:id", authMiddleware, movieController.getMovieDetails);

module.exports = router;
