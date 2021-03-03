const User = require("../models/user")
const Notedo = require("../models/notedo")
const { validationResult } = require("express-validator");
const enviarEmail = require("../handlers/email");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const html = require("./assets/mailTemplate");

exports.saveUser = async (req, res, next) => {

    // verificar que no existan errores de validacion
    const errors = validationResult(req);
    const errorsArray = [];

    // si hay errores
    try {
        if (!errors.isEmpty()) {
            errors.array().map(error => errorsArray.push(error.msg));
            // enviar los errores al usuario
            res.status(400).send(errorsArray)

        } else {
            // crear el usuario
            const user = new User(req.body)
            await user.save();

            const savedUser = await User.findOne({ email: req.body.email })

            const notedo = new Notedo({ userID: savedUser._id })

            notedo.save()

            res.status(200).send({ message: "Te has registrado correctamente." })

        }
    } catch (error) {
        res.status(422).send({ message: "Ha ocurrido un error" })
    }
}

exports.sendUser = (req, res) => {
    res.status(200).send({ user: req.user })
}


exports.sendToken = async (req, res) => {

    // Verificar si el correo electrónico es válido
    const user = await User.findOne({ email: req.body.email });

    // Si el usuario no existe
    if (!user) {
        res.status(400).send({ message: "No existe una cuenta con ese correo." });
    }

    try {

        // El usuario existe, generar el token
        user.token = crypto.randomBytes(20).toString("hex");
        user.expires = Date.now() + 3600000;

        // Guardar el usuario
        await user.save();

        // Generar la URL
        const resetUrl = 
            html.htmls.html1 + 
            `http://${req.headers.host}/images/Top.png` + 
            html.htmls.html2 +
            `http://${req.headers.host}/images/NT.png` +
            html.htmls.html3 +
            `https://${req.body.clientHost}/#/newPass/${user.token}` +
            html.htmls.html4

        // Enviar la notificación por email
        await enviarEmail.enviar({
            user,
            subject: "Reestablecer tu contraseña",
            html: resetUrl,
            resetUrl,

        });

        res.status(200).send({ message: "Se ha enviado el correo" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Ha ocurrido un error" });;
    } 

};

exports.showResetPass = async (req, res) => {
    try {
        // buscar el usuario por medio del token y la fecha de expiración
        const user = await User.findOne({
            token: req.params.token,
            expires: { $gt: Date.now() }
        });

        // No se pudo encontrar el usuario con el token o token vencido
        if (!user) {
            res.status(408).send({ message: "Solicitud expirada. Vuelve a solicitar el cambio de contraseña" });
        }


        res.status(200).send({ message: "Token valido" });


    } catch (error) {
        res.status(500).send({ message: "Ha ocurrido un error" });
    }

};


exports.changePassword = async (req, res) => {
    try {
        // buscar el usuario por medio del token y la fecha de expiración
        const user = await User.findOne({
            token: req.params.token,
            expires: { $gt: Date.now() }
        });

        // No se pudo encontrar el usuario con el token o token vencido
        if (!user) {
            res.status(408).send({ message: "Solicitud expirada. Vuelve a solicitar el cambio de contraseña" });
        }

        // Obtener el nuevo password

        await new Promise((resolve, reject) => {
            if (req.body.password == req.body.confirm_password) {
                user.password = req.body.password;
                resolve(true)
            } else {
                res.status(400).send({ message: "las contraseñas no coinciden." })
            }
        });



        // Limpiar los valores que ya no son requeridos
        user.token = undefined;
        user.expira = undefined;

        // Almacenar los valores en la base de datos
        await user.save();

        // Redireccionar
        res.status(200).send({ message: "Contraseña modificada correctamente" });
    } catch (error) {
        res.status(500).send({ message: "Ha ocurrido un error" });
    }
};




exports.editProfile = async (req, res) => {
    console.log("asdasdasd");
    
    try {
        // Buscar el usuario
        const user1 = await User.findById(req.user._id);

        // Modificar los valores
        user1.name = req.body.name;
        user1.email = req.body.email;


        if (req.body.password != "") {
            await new Promise((resolve, reject) => {
                bcrypt.compare(req.body.password, user1.password, function (err, isMatch) {
                    if (err) throw err;

                    if (isMatch) {
                        if (req.body.new_password) {
                            if (req.body.new_password == req.body.new_password_confirm) {
                                user1.password = req.body.new_password;
                                resolve(user1.password)
                            } else {
                                res.status(400).send({ message: "las contraseñas no coinciden." });
                            }
                        } else {
                            resolve(true)
                        }

                    } else {
                        res.status(400).send({ message: "contraseña actual incorrecta." });
                    }
                })
            });
        }

        // Guardar los cambios
        await user1.save(function (err, cb) {
            console.log(err);

        });
        res.status(200).send({ message: "Cambios almacenados correctamente" });


    } catch (error) {
        console.log(error);
        
        res.status(500).send({ message: "Ha ocurrido un error" });
    }

};
