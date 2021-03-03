const passport = require("passport");
const mongoose = require("mongoose");

exports.authenticateUser = passport.authenticate('local',{
    successRedirect: "/succesLogin",
    failureRedirect: "/failureLogin"
});

exports.succesLogin = (req, res) => {
    res.set('Content-Type', 'text/html')
    console.log(req.session.cookie, req.user);
    
    res.status(200).send({message : "Bienvenido"})
    
}

exports.failureLogin = (req, res) => {
    res.status(400).send({message: "Nombre de usuario o contraseña invalidos."})
}
exports.logOut = function (req, res) {
    req.logout();
    res.status(200).send({ message: "Cerraste sesión"})
}

exports.checkUser = (req, res, next) => {
    // Retorna true si el usuario ya realizó la autenticación
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).send({ message: "No autorizado."})
    }
};