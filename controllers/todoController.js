const Notedo = require("../models/notedo");

// Agregar tarea(todo)
exports.addTodo = async (req, res, next) => {
    try {
        await Notedo.updateOne({
            userID: req.user._id
        },
        {
            $push:{todo:{
                "body": req.body.body,
                "status": req.body.status,
                "color": req.body.color,
                "textColor": req.body.textColor
            }}
        }
        )
        res.status(201).send({ message: "Tarea agregada correctamente" });
    } catch (error) {
        res.status(422).send({error: "ha ocurrido un error al momento de guardar la tarea"})
     }
};


// Obtiene una tarea(todo) por su id
exports.getOneTodo = async (req, res, next) => {
    try {
        const todo = await Notedo.findOne({userID: req.user._id},{todo:{$elemMatch: {_id: req.params.idTodo }}});

        if (!todo) {
            res.status(404).send({ error: "la tarea no existe" });
        } else {
            res.status(200).send(todo.todo);
        }
    } catch (error) {
        res.status(422).send({ error: "Ha ocurrido un error al momento de obtener la tarea" });
    }
}


// Obtiene todas las tareas(todo)
exports.getAllTodos = async (req, res, next) => {
    try {
        const todo = await Notedo.findOne({userID: req.user._id});

        if (!todo) {
            res.status(404).send({ error: "Error al obtener las tareas." });
        } else {
            res.status(200).send(todo.todo);
        }
    } catch (error) {
        res.status(422).send({ error: "Ha ocurrido un error al momento de obtener las tareas" });
    }
}


// Actualiza una tarea(todo) por su id
exports.updateTodo = async (req, res, next) => {   
    try {
        await Notedo.updateOne(
            {userID: req.user._id, "todo._id":req.params.idTodo },
            {$set:{
                "todo.$.body": req.body.body,
                "todo.$.status": req.body.status,
                "todo.$.lastModified": Date.now(),
                "todo.$.color": req.body.color,
                "todo.$.textColor": req.body.textColor 
            }}
        );

        res.status(200).send({message: "Modificada correctamente"});
    } catch (error) {
        console.log(error);
        
        res
            .status(422)
            .send({ error: "Ha ocurrido un error al momento de actualizar" });
    }
};


// Eliminar una tarea(todo) por su id
exports.deleteTodo = async (req, res, next) => {
    try {
        await Notedo.updateOne(
            {userID: req.user._id},
            {$pull:{"todo":{"_id": req.params.idTodo }}}
        );

        res.status(200).send({ mensaje: "Tarea eliminada satisfactoriamente" });
    } catch (error) {
        res
            .status(422)
            .send({ error: "Ha ocurrido un error al eliminar" });
    }
};

