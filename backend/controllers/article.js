'use strict'
const validator = require('validator');
const fs = require('fs');
const path = require('path');

const Article = require('../models/article');

var controller = {
    save: (req, res) =>{
        //Recoger parametros por post
        var params = req.body;
        //validar datos(validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }
        if(validate_title && validate_content){
            //crear objeto a guardar
            const article = new Article();
            //asigna valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;
            //guardar el articulo
            article.save()
                .then( () => {
                    return res.status(200).send({
                        status: 'success',
                        article: article
                    });
                }).catch(error => {
                    // console.error(error);
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado.'
                    });
                });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos.'
            });
        }
    },
    getArticles: (req, res) => {
        const last = req.params.last;
        var query = Article.find({})
        if(last || last != undefined){
            query.limit(5);
        }
        query.sort('-_id').exec()
            .then((articles) => {
                if(!articles){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            }).catch(error => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Ha ocurrido un error.'
                });
            });
    },
    getArticle: (req, res) =>{
        //recoger el id de la url
        var articleId = req.params.id;
        //comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }
        //busca el articulo
        Article.findById(articleId)
        .then((article) =>{
            if(!article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                }); 
            }
            //devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });

        })
        .catch((err) =>{
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver los datos'
            });
        })
    },
    update: (req, res) =>{
        //recoger el id
        const articleId = req.params.id;
        //recoger los datos que llegan por put
        var params = req.body;
        //validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            }); 
        }

        if(validate_content && validate_title){
            //find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true})
            //dar respuesta
            .then((updateArticle) =>{
                if(!updateArticle){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'
                    }); 
                }
                return res.status(200).send({
                    status: 'success',
                    article: updateArticle
                });
            })
            .catch((err) =>{
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar'
                }); 
            });
        }else{
            return res.status(404).send({
                status: 'error',
                message: 'La validacion no es correcta'
            }); 
        }
    },
    delete: (req, res) =>{
        const idArticle = req.params.id;
        Article.findOneAndDelete({_id: idArticle})
        .then((deleteArticle) =>{
            if(!deleteArticle){
                return res.status(404).send({
                    status: 'error',
                    message: 'No ha borrado el articulo, no existe'
                }); 
            }
            return res.status(200).send({
                status: 'success',
                article: deleteArticle
            });
        })
        .catch((err) =>{
            return res.status(500).send({
                status: 'error',
                message: 'Error al borrar'
            }); 
        })
    },
    upload: (req, res) =>{
        //configurar el modulo connect multiparty router/article.js

        //recoger el fichero
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: 'No se subio el archivo'
            }); 
        }

        //conseguir nombre y la extension
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        //EN LINUX O MAC es: file_split = file_path.split('/');
        file_name = file_split[file_split.length - 1];
        var file_extension_split = file_name.split('\.');
        var file_ext = file_extension_split[1];

        //conprobar la extension, solo imagenes, si no es validad borrar fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //borrar el archivo subido
            fs.unlink(file_path).catch((err) =>{
                return res.status(404).send({
                    status: 'Error',
                    message: 'La extension de la imagen no es valida'
                });
            });
        }else{
            const articleId = req.params.id;
            //buscar el articulo, asignarle el nombre y actualizarlo
            Article.findOneAndUpdate({_id:articleId}, {image: file_name}, {new:true})
            .then((updateArticle) =>{
                if(!updateArticle){
                    return res.status(404).send({
                        status: 'Error',
                        message: 'Ocurrio un error al guardar la imagen'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: updateArticle
                });
            })
            .catch((err) =>{
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error desde el servidor'
                });
            })
        }
    }
};

module.exports = controller;