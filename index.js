const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const mongoose = require("mongoose");
const path = require("path");
mongoose.set('useCreateIndex', true);
const createError = require("http-errors");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const cors= require("cors");

// importar variables globales
require("dotenv").config({ path: "variables.env"});

// crear el servidor de node
const app = express();

// elementos estaticos
app.use(express.static(path.join(__dirname,"public")));

// configuración de la conexion de mongo y mongoose
const mongoUri = process.env.DATABASE;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.connection.on("connected", () => {
    console.log("conected to mongo cluster.");
});
mongoose.connection.on("error", err => {
    console.log("Error while connecting to mongo.", err);
});

// Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SECRET,
        key: process.env.KEY,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

//passport config
require("./config/passport")(passport)
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    methods:['GET','POST'],
    credentials: true ,
    origin: 'https://notedo.herokuapp.com',
    methods: 'GET, POST, OPTIONS, PUT, DELETE'
}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://notedo.herokuapp.com');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}) 

// llamada a las rutas
app.use("/", routes());

 // Administración de los errores
app.use((error, req, res, next) => {
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status).send(error.message);
  
 });


 const host = "0.0.0.0";
 const port = process.env.PORT;
 

// Escuchar en el puerto 9888
app.listen(port, host, () => {
    console.log("Listening on port 9888");
});