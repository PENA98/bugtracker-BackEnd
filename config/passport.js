const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const user = require("../models/user")
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
    //Local Strategy
    passport.use(new localStrategy({
        usernameField: "email",
        passwordField: "password"
    }, function (username, password, done) {

        let query = { email: username }
        //verificar email
        user.findOne(query, function (err, user) {
            
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: "No se encontró el usuario" });
            }

            bcrypt.compare(password, user.password, function (err, isMatch) {            
                if (err) throw err;

                if (isMatch) {
                    return done(null, user);
                    
                } else {
                    return done(null, false, { message: ["Contraseña equivocada"] });
                }
            });
        });


    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        
        user.findById(id, function (err, user) {
            done(err, user);
        });
    });
};