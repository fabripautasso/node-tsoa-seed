import * as express from "express";
import * as swaggerUi from "swagger-ui-express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import "reflect-metadata";

import constants from "./constants";
import { ErrorHandler } from "./ErrorHandler";
import { RegisterRoutes } from "../../build/routes";
import { Logger } from "./Logger";
import { iocContainer } from "../ioc";
import "../controllers";
import { SQLDbConnection } from "./SQLDbConnection";

export class Server {
  public app: express.Express = express();
  private readonly port: number = constants.port;

  constructor() {
    this.app.use(this.allowCors);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(morgan("dev", { skip: () => !Logger.shouldLog }));
    RegisterRoutes(this.app);
    this.app.use(ErrorHandler.handleError);

    const swaggerDocument = require("../../build/swagger/swagger.json");
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }

  public async listen(port: number = this.port) {
    process.on("uncaughtException", this.criticalErrorHandler);
    process.on("unhandledRejection", this.criticalErrorHandler);
    const dbConnection = iocContainer.get<SQLDbConnection>(SQLDbConnection);
    await dbConnection.initializeDbConnection();
    const listen = this.app.listen(this.port);
    Logger.info(
      `${constants.environment} server running on port: ${this.port}`
    );
    return listen;
  }

  private criticalErrorHandler(...args) {
    Logger.error("Critical Error...", ...args);
    process.exit(1);
  }

  private allowCors(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS,CONNECT"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, apikey, x-access-token"
    );
    next();
  }
}
