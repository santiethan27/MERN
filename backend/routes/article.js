'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './upload/articles'});
//rutas para articulo
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id', md_upload, ArticleController.upload);

module.exports = router;