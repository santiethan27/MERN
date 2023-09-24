'use strict'

//Cargar modulos
var express = require('express');
var bodyParser = require('body-parser')
//Ejecutar express(htpp)
var app = express();
//Cargar ficheros rutas
var article_routes = require('./routes/article')
//MiddLewares(Es lo que se ejecuta antes de cargar una URL)
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//CORS(Permitir peteciones desde el from)

//AÑADIR PREFIJOS A RUTAS
app.use('/api', article_routes);

//exportar modulo
module.exports = app;