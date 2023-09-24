'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900; 

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/miapi', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>{
            console.log('Laa conexión a la base de datos ha sido éxitosa.');

            //Crear servidor y ponerme a escuchar peticiones HTTP
            app.listen(port, ()=>{
                console.log('Servidor corriendo en http://localhost:'+port);
            });
        });

