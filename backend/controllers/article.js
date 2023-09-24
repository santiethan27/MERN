'use strict'
const validator = require('validator');
const Article = require('../models/article');
const article = require('../models/article');

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
        
    }


};

module.exports = controller;