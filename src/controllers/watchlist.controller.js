const { Watchlist } = require("../models");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// Configuração da API TMDB
const tmdbAPI = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: "pt-BR",
  },
});

// Buscar filmes na watchlist do usuário
exports.getWatchlist = async (req, res) => {
  try {
    // Buscar a watchlist do usuário logado
    const watchlist = await Watchlist.findAll({
      where: { userId: req.userId },
      order: [["addedAt", "DESC"]],
    });

    res.status(200).json({ watchlist });
  } catch (error) {
    console.error("Erro ao buscar watchlist:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar watchlist", error: error.message });
  }
};

// Adicionar filme à watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const { tmdbMovieId } = req.params;

    if (!tmdbMovieId) {
      return res.status(400).json({ message: "ID do filme é obrigatório" });
    }

    // Verificar se o filme já está na watchlist do usuário
    const existingItem = await Watchlist.findOne({
      where: {
        userId: req.userId,
        tmdbMovieId: parseInt(tmdbMovieId),
      },
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Filme já está na sua watchlist" });
    }

    // Buscar informações do filme na API TMDB
    const movieResponse = await tmdbAPI.get(`/movie/${tmdbMovieId}`);
    const movieData = movieResponse.data;

    // Adicionar filme à watchlist
    const watchlistItem = await Watchlist.create({
      userId: req.userId,
      tmdbMovieId: parseInt(tmdbMovieId),
      title: movieData.title,
      posterPath: movieData.poster_path,
      watched: false,
      addedAt: new Date(),
    });

    res.status(201).json({
      message: "Filme adicionado à watchlist",
      watchlistItem: {
        id: watchlistItem.id,
        tmdbMovieId: watchlistItem.tmdbMovieId,
        title: watchlistItem.title,
        posterPath: watchlistItem.posterPath
          ? `https://image.tmdb.org/t/p/w500${watchlistItem.posterPath}`
          : null,
        addedAt: watchlistItem.addedAt,
        watched: watchlistItem.watched,
      },
    });
  } catch (error) {
    console.error("Erro ao adicionar filme à watchlist:", error);

    // Tratar erro específico de filme não encontrado
    if (error.response && error.response.status === 404) {
      return res
        .status(404)
        .json({ message: "Filme não encontrado na API TMDB" });
    }

    res.status(500).json({
      message: "Erro ao adicionar filme à watchlist",
      error: error.message,
    });
  }
};

// Remover filme da watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    const { tmdbMovieId } = req.params;

    if (!tmdbMovieId) {
      return res.status(400).json({ message: "ID do filme é obrigatório" });
    }

    // Remover filme da watchlist
    const deleted = await Watchlist.destroy({
      where: {
        userId: req.userId,
        tmdbMovieId: parseInt(tmdbMovieId),
      },
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Filme não encontrado na sua watchlist" });
    }

    res
      .status(200)
      .json({ message: "Filme removido da watchlist com sucesso" });
  } catch (error) {
    console.error("Erro ao remover filme da watchlist:", error);
    res.status(500).json({
      message: "Erro ao remover filme da watchlist",
      error: error.message,
    });
  }
};

// Função para verificar se um filme está na watchlist do usuário
exports.checkIfInWatchlist = async (req, res) => {
  try {
    const { tmdbMovieId } = req.params;

    if (!tmdbMovieId) {
      return res.status(400).json({ message: "ID do filme é obrigatório" });
    }

    // Verificar se o filme já está na watchlist do usuário
    const existingItem = await Watchlist.findOne({
      where: {
        userId: req.userId,
        tmdbMovieId: parseInt(tmdbMovieId),
      },
    });

    // Retornar resultado da verificação
    return res.status(200).json({
      isInWatchlist: !!existingItem,
    });
  } catch (error) {
    console.error("Erro ao verificar filme na watchlist:", error);
    res.status(500).json({
      message: "Erro ao verificar filme na watchlist",
      error: error.message,
    });
  }
};
// src/controllers/watchlist.controller.js

// Marcar filme como assistido ou não assistido
exports.toggleWatched = async (req, res) => {
  try {
    const { tmdbMovieId } = req.params;
    const { watched } = req.body; // true para marcar como assistido, false para não assistido

    if (!tmdbMovieId) {
      return res.status(400).json({ message: "ID do filme é obrigatório" });
    }

    // Encontrar o item na watchlist
    const watchlistItem = await Watchlist.findOne({
      where: {
        userId: req.userId,
        tmdbMovieId: parseInt(tmdbMovieId),
      },
    });

    if (!watchlistItem) {
      return res
        .status(404)
        .json({ message: "Filme não encontrado na sua watchlist" });
    }

    // Atualizar o status de assistido
    await watchlistItem.update({
      watched: watched === true, // Garantir que seja booleano
      watchedAt: watched === true ? new Date() : null,
    });

    res.status(200).json({
      message: watched
        ? "Filme marcado como assistido"
        : "Filme marcado como não assistido",
      watchlistItem: {
        id: watchlistItem.id,
        tmdbMovieId: watchlistItem.tmdbMovieId,
        title: watchlistItem.title,
        posterPath: watchlistItem.posterPath
          ? `https://image.tmdb.org/t/p/w500${watchlistItem.posterPath}`
          : null,
        watched: watchlistItem.watched,
        watchedAt: watchlistItem.watchedAt,
        addedAt: watchlistItem.addedAt,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar status do filme:", error);
    res.status(500).json({
      message: "Erro ao atualizar status do filme",
      error: error.message,
    });
  }
};
