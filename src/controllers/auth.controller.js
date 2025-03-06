const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Validação de senha forte
const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/;
  return regex.test(password);
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, birthdate } = req.body;

    // Validar dados
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, senha e nome são obrigatórios" });
    }

    // Verificar senha forte
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "A senha deve ter no mínimo 8 caracteres, incluindo números e caracteres especiais",
      });
    }

    // Verificar se o email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Este email já está em uso" });
    }

    // Criar usuário
    const user = await User.create({
      email,
      password,
      name,
      birthdate: birthdate || null,
    });

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "jwt-secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuário criado com sucesso",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao registrar usuário", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar dados
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios" });
    }

    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Verificar senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "jwt-secret",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao fazer login", error: error.message });
  }
};
