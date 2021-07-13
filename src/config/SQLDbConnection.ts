import constants from "./constants";
import { Logger } from "./Logger";
import { ProvideSingleton } from "../ioc";
import { createConnection, Connection } from "typeorm";

@ProvideSingleton(SQLDbConnection)
export class SQLDbConnection {
  public connection: Connection;

  public initializeDbConnection = async () => {
    const config = constants.SQL;
    Logger.info(`connecting to ${constants.environment} SQL ...`);
    let entitiesPaths;
    if (constants.environment === "production")
      entitiesPaths = [
        "dist/src/persistance/entity/*.js",
        "dist/src/persistance/entity/*/*.js"
      ];
    else
      entitiesPaths = [
        "src/persistance/entity/*.ts",
        "src/persistance/entity/*/*.ts"
      ];

    try {
      const conn = await createConnection({
        type: "postgres",
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.name,
        entities: entitiesPaths,
        synchronize: true,
        logging: config.logging === "true"
      });
      Logger.info(`connected to ${constants.environment} SQL`);
      this.connection = conn;
    } catch (e) {
      Logger.error("TypeORM connection error: ", e);
    }
  };
}
