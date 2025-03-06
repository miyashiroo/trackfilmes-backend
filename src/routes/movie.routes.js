const router = require("express").Router();
const movieController = require("../controllers/movie.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Rota de busca
router.get("/search", authMiddleware, movieController.searchMovies);

// Rota para detalhes do filme
router.get("/:id", authMiddleware, movieController.getMovieDetails);

module.exports = router;
