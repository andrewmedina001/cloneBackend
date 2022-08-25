import express from 'express';
import cors from "cors";
import { PrismaConnector } from "./prisma.js"
import { categoriesRouter } from './routes/categories.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { usersRouter } from './routes/users.routes.js';
import { paymentsRouter } from './routes/payments.routes.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT;

const swaggerOptions={
  swaggerDefinition: {
    openapi:"3.0.0",
    info: {
      title: 'App de Javier Castillo',
      version: '1.0.0',
      description:'description of the project'
    },
    servers:[{url:"http://localhost:8000"}],
  },
  apis: ['./routes/*.js'], 
}
const swaggerDocs=swaggerJsDoc(swaggerOptions)

app.use(
  cors({
    origin: [process.env.APP_URL, process.env.ADMIN_APP_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["accept", "authorization", "content-type"]
  })
)

app.use(express.json());

// app.get("/categories", async (req, res) => {
//   try {
//     const result = await PrismaConnector.category.findMany();
//     console.log(result)
//     return res.json({
//       message: "Hi",
//       result
//     })
//   } catch (error) {
//     return res.status(400).json({
//       message: "Something went wrong",
//       result: error.message
//     })
//   }
// })

app.use(categoriesRouter)
app.use(productsRouter)
app.use(usersRouter)
app.use(paymentsRouter)

// 
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
})