const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const noteController = require("../controllers/noteController");
const todoController = require("../controllers/todoController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");


module.exports = function () {

    router.post("/register",[
        check("name", "El nombre de usuario es requerido.")
            .not()
            .isEmpty()
            .escape(),
        check("email","El correo electrónico es requerido.")
            .not()
            .isEmpty(),
        check("email", "El correo electrónico no es vålido.")
            .isEmail()
            .normalizeEmail(),
        check("password", "La contraseña es requerida.")
            .not()
            .isEmpty(),
        check("confirmpassword", "Debe ingresar la confirmacion de su contraseña.")
            .not()
            .isEmpty(),
        check("confirmpassword", "Las contraseñas no coinciden.")
            .custom((value, { req }) => value === req.body.password)
    ], userController.saveUser);

    // auth routes
    router.get("/user", authController.checkUser, userController.sendUser)
    router.post("/login", authController.authenticateUser);
    router.get("/logout", authController.checkUser, authController.logOut);
    router.get("/succesLogin", authController.checkUser, authController.succesLogin);
    router.get("/failureLogin", authController.failureLogin);
    router.post("/resetPass", userController.sendToken)
    router.get("/resetPass/:token", userController.showResetPass)
    router.post("/resetPasss/:token", userController.changePassword)
    router.post("/editProfile", authController.checkUser, userController.editProfile)


    // Operaciones de las notas 
    router.post("/note", authController.checkUser, noteController.addNote);               // C
    router.get("/note/:idNote", authController.checkUser, noteController.getOneNote);     // R
    router.get("/note", authController.checkUser, noteController.getAllNotes);            // R
    router.put("/note/:idNote", authController.checkUser, noteController.updateNote);     // U
    router.delete("/note/:idNote", authController.checkUser, noteController.deleteNote);  // D


    // Operaciones de las tareas
    router.post("/todo", authController.checkUser, todoController.addTodo);               // C
    router.get("/todo/:idTodo", authController.checkUser, todoController.getOneTodo);     // R
    router.get("/todo", authController.checkUser, todoController.getAllTodos);            // R
    router.put("/todo/:idTodo", authController.checkUser, todoController.updateTodo);     // U
    router.delete("/todo/:idTodo", authController.checkUser, todoController.deleteTodo);  // D



    return router;
}