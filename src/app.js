// load .env config
import 'dotenv/config';
import express from 'express';
import routes from './routes';
import './database';
// create class to application for structure improvements
class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
