var express = require('express');
var router = express.Router();

var mainController = require('../controllers/main-controller.js');
var authController = require('../controllers/auth-controller.js');

router.get('/', mainController.displayLoginPage);

router.get('/login', mainController.loginSuccessful);


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
