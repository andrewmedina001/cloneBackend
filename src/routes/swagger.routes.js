import { Router } from "express";
import swaggerUi from 'swagger-ui-express';
import YAML from "yamljs";
// import swaggerDocument from '../swagger.json' assert {type: 'json'}

const swaggerYAML = YAML.load("./src/utils/swagger.yaml")

export const swaggerRouter = Router ()

swaggerRouter.use("/api-docs", swaggerUi.serve);
swaggerRouter.get("/api-docs", swaggerUi.setup(swaggerYAML));