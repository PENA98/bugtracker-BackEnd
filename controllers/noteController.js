const Notedo = require("../models/notedo");

// Agrega una nueva nota
exports.addNote = async (req, res, next) => {
    try {
        await Notedo.updateOne({
            userID: req.user._id
        },
        {
            $push:{note:{
                "title": req.body.title,
                "body": req.body.body,
                "color": req.body.color,
                "textColor": req.body.textColor
            }}
        }
        )
    
        res.status(201).send({ message: "nota agregada correctamente" });
    } catch (error) {
        res.status(422).send({ error: "ha ocurrido un error al momento de guardar la nota" })
    }
};

// Obtiene una nota por su id
exports.getOneNote = async (req, res, next) => {
    try {
        const note = await Notedo.findOne({userID: req.user._id},{note:{$elemMatch: {_id: req.params.idNote }}});
        
        if (!note) {
            res.status(404).send({ error: "la nota no existe" });
        } else {
            res.status(200).send(note.note);
        }
    } catch (error) {
        res.status(422).send({ error: "Ha ocurrido un error al momento de obtener la nota" });
    }
}


// Obtiene todas las notas
exports.getAllNotes = async (req, res, next) => {
    try {
        const note = await Notedo.findOne({userID: req.user._id});
        
        if (!note) {
            res.status(404).send({ error: "Error al obtener las notas." });
        } else {
            res.status(200).send(note.note);
        }
    } catch (error) {
        res.status(422).send({ error: "Ha ocurrido un error al momento de obtener las notas" });
    }
}


// Actualiza una nota por su id
exports.updateNote = async (req, res, next) => {
    try {

        await Notedo.updateOne(
            {userID: req.user._id, "note._id":req.params.idNote },
            {$set:{
                "note.$.title": req.body.title,
                "note.$.body": req.body.body,
                "note.$.lastModified": Date.now(), 
                "note.$.color": req.body.color,
                "note.$.textColor": req.body.textColor 
            }}
        );

        res.status(200).send({message: "Actualizada correctamente"});
    } catch (error) {
        console.log(error);
        
        res
            .status(422)
            .send({ error: "Ha ocurrido un error al momento de actualizar" });
    }
};


// Eliminar una nota por su id
exports.deleteNote = async (req, res, next) => {
    try {
        await Notedo.updateOne(
            {userID: req.user._id},
            {$pull:{"note":{"_id": req.params.idNote }}}
        );

        res.status(200).send({ mensaje: "Nota eliminada satisfactoriamente" });
    } catch (error) {
        res
            .status(422)
            .send({ error: "Ha ocurrido un error al eliminar" });
    }
};
