const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// Configuração da API TMDB
const tmdbAPI = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: "pt-BR", // Você pode alterar para 'en-US' se preferir inglês
  },
});

// Buscar filmes por termo
exports.searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Termo de busca é obrigatório" });
    }

    const response = await tmdbAPI.get("/search/movie", {
      params: {
        query,
        page,
      },
    });

    // Formatar os resultados para retornar apenas os dados necessários
    const formattedResults = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
    }));

    res.status(200).json({
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
      results: formattedResults,
    });
  } catch (error) {
    console.error("Erro na API TMDB:", error.response?.data || error.message);
    res.status(500).json({
      message: "Erro ao buscar filmes",
      error: error.response?.data?.status_message || error.message,
    });
  }
};

// Obter detalhes de um filme específico
exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await tmdbAPI.get(`/movie/${id}`);

    // Formatar o resultado
    const movieDetails = {
      id: response.data.id,
      title: response.data.title,
      originalTitle: response.data.original_title,
      overview: response.data.overview,
      posterPath: response.data.poster_path
        ? `https://image.tmdb.org/t/p/w500${response.data.poster_path}`
        : null,
      backdropPath: response.data.backdrop_path
        ? `https://image.tmdb.org/t/p/original${response.data.backdrop_path}`
        : null,
      releaseDate: response.data.release_date,
      runtime: response.data.runtime,
      genres: response.data.genres,
      voteAverage: response.data.vote_average,
      voteCount: response.data.vote_count,
    };

    res.status(200).json(movieDetails);
  } catch (error) {
    console.error("Erro na API TMDB:", error.response?.data || error.message);

    // Tratar erro específico de filme não encontrado
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }

    res.status(500).json({
      message: "Erro ao buscar detalhes do filme",
      error: error.response?.data?.status_message || error.message,
    });
  }
};
