const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

// Validação de senha forte
const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/;
  return regex.test(password);
};

// Buscar perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar perfil", error: error.message });
  }
};

// Atualizar informações do perfil (nome, email, data de nascimento)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, birthdate } = req.body;

    // Verificar se o email já existe (se for diferente do atual)
    if (email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: req.userId },
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Este email já está em uso" });
      }
    }

    // Atualizar usuário
    const [updated] = await User.update(
      {
        name: name || undefined,
        email: email || undefined,
        birthdate: birthdate || undefined,
      },
      { where: { id: req.userId } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      message: "Perfil atualizado com sucesso",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar perfil", error: error.message });
  }
};

// Atualizar senha (requer senha atual)
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Senha atual e nova senha são obrigatórias" });
    }

    // Verificar senha forte
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "A nova senha deve ter no mínimo 8 caracteres, incluindo números e caracteres especiais",
      });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Verificar senha atual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha atual incorreta" });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar senha", error: error.message });
  }
};

// Excluir conta de usuário
exports.deleteUser = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.userId);
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // Excluir o usuário
    const deleted = await User.destroy({
      where: { id: req.userId },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Conta excluída com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir conta", error: error.message });
  }
};
