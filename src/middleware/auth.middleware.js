const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Obter token do cabeçalho
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Token de autenticação não fornecido" });
    }

    const token = authHeader.split(" ")[1]; // Formato: Bearer TOKEN

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwt-secret");

    // Adicionar ID do usuário à requisição
    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
};
