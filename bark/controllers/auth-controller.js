var authController = {};

//Authenticates the user and binds user model to req.user if successful.
authController.authenticate = function (req, res, next){
    if (req.session.passport){
      req.username = req.session.passport.user.displayName;
      return next();
    }
    //Redirect to login screen if not logged in!
    else return res.redirect('/');
};

module.exports = authController;