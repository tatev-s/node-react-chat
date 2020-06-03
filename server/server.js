import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from "dotenv";
import routes from './server/routes/index';
import chat from "./server/helpers/socketio";
import errorHandler from "./server/helpers/errorHandler";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.static('client/assets'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('layout', 'layouts/layout');
app.use(express.json());
app.use(routes);
app.use(errorHandler);
const server = app.listen(3002,'127.0.0.1',  () => {
  console.log(`Server running at http://localhost:3002/`);
});
chat.init(server);

