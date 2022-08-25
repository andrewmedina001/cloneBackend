import {Router} from "express"
import { 
    createTestUser ,
    preferencesTest,
    createPayment,
    notificationsMercadoPago
} from "../controllers/payments.controllers.js"

export const paymentsRouter=Router()

paymentsRouter.route("/createTestUser").post(createTestUser);
paymentsRouter.route("/preferencesTest").post(preferencesTest);
paymentsRouter.post("/create-pago",createPayment);
paymentsRouter.post("/mercado-pago-notificaciones",notificationsMercadoPago);