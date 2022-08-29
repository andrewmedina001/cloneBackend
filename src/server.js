import express from 'express';
import cors from "cors";
import { PrismaConnector } from "./prisma.js"
import { categoriesRouter } from './routes/categories.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { usersRouter } from './routes/users.routes.js';
import { paymentsRouter } from './routes/payments.routes.js';
import { swaggerRouter } from './routes/swagger.routes.js';

import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
// import swagerDocument from './swagger.json' assert {type:"json"};
// const swagerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT;


app.use(
  cors({
    origin: [process.env.APP_URL, process.env.ADMIN_APP_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["accept", "authorization", "content-type"]
  })
)


const options = {
  definition: {
      openapi: '3.0.0',
      info: {
          title: 'Hello World',
          version: '1.0.0',
      },
  },
  apis: ['./src/routes*.js'],
};

const openapiSpecification = swaggerJsdoc(options);


app.use(express.json());


app.use(categoriesRouter)
app.use(productsRouter)
app.use(usersRouter)
app.use(paymentsRouter)
app.use(swaggerRouter)
app.use("/api-docs" , swaggerUI.serve, swaggerUI.setup(openapiSpecification))

app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
})