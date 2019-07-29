import express from 'express';
import path from "path";
import siofu from "socketio-file-upload";
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './server/routes/index';
import session from 'express-session';
import passport from 'passport';
const app = express();
const viewPath = path.join(__dirname, 'client/views')
app.use(express.static('client/assets'))
app.use(siofu.router);
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.set('views', viewPath);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('layout', 'layouts/layout');
app.use(express.json());
app.use(session({
  secret: 'app.session.secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge:30 * 24 * 3600 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);
const server = app.listen(3002,'127.0.0.1',  () => {
  console.log(`Server running at http://localhost::3002/`);
});
require('./server/helpers/socketio')(server);
