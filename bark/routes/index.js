var express = require('express');
var router = express.Router();

var mainController = require('../controllers/main-controller.js');
var authenticate = require('../controllers/auth-controller.js').authenticate;

router.get('/', mainController.displayLoginPage);

// router.get('/login', mainController.loginSuccessful);

router.get('/dashboard', authenticate, mainController.displayDashboard);

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
