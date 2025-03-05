const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Todas as rotas utilizam o middleware de autenticação
router.use(authMiddleware);

// Rotas para gerenciamento de perfil
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.put("/password", userController.updatePassword);
router.delete("/delete", userController.deleteUser); //

module.exports = router;
