const router = require("express").Router();
const watchlistController = require("../controllers/watchlist.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Todas as rotas utilizam o middleware de autenticação
router.use(authMiddleware);

// Listar filmes na watchlist
router.get("/", watchlistController.getWatchlist);

// Adicionar filme à watchlist
router.post("/:tmdbMovieId", watchlistController.addToWatchlist);

// Remover filme da watchlist
router.delete("/:tmdbMovieId", watchlistController.removeFromWatchlist);

//Verifica se o filme já está na watchlist
router.get(
  "/watchlist/check/:tmdbMovieId",
  watchlistController.checkIfInWatchlist
);

// Marcar filme como assistido/não assistido
router.patch("/:tmdbMovieId/watched", watchlistController.toggleWatched);

module.exports = router;
