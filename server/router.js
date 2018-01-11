const authController = require('./controllers/authentication');
const { catchErrors } = require('./utils/error-handlers');
const passport = require('passport');
const passportService = require('./services/passport');

// Create authentication middleware with passport jwt strategy
const requireAuth = passport.authenticate('jwt', { session: false });
// Create signin middleware with passport local strategy
const requireSignin = passport.authenticate('local', { session: false });


module.exports = app => {
  app.get('/', requireAuth, (req, res) => res.json({ hi: true }));
  app.post('/signup', catchErrors(authController.signup));
  app.post('/signin', requireSignin, catchErrors(authController.signin));
};