var mainController = {};

mainController.displayLoginPage = function(req, res, next) {
  res.render('index', { title: 'Login to Bark' });
}

mainController.loginSuccessful = function(req, res, next) {
  res.render('index', { title: 'Login Successful' });
}

module.exports = mainController;