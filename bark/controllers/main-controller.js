var mainController = {};

mainController.displayLoginPage = function(req, res, next) {
  res.render('index', { title: 'Login to Bark' });
}

mainController.loginSuccessful = function(req, res, next) {
  res.render('index', { title: 'Login Successful' });
}

mainController.displayDashboard = function(req, res, next) {
  res.render('dashboard', { username: 'Test_Username' });
}

module.exports = mainController;