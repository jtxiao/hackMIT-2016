var mainController = {};

mainController.displayLoginPage = function(req, res, next) {
  res.render('index', { title: 'Login to Bark' });
}

mainController.loginSuccessful = function(req, res, next) {
  res.render('index', { title: 'Login Successful' });
}

mainController.displayDashboard = function(req, res, next) {
  console.log(req.session);
  res.render('dashboard', { username: req.username });
}

module.exports = mainController;