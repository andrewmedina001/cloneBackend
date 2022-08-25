import _ from "lodash"
import axios from "axios"
import mercadopago from "mercadopago"
// import { trolleyModel } from "../models/trolleys.js"
// import { productModel } from "../models/products.js"
// import { orderModel } from "../models/orders.js" 

import { PrismaConnector } from "../prisma.js";
import { categoryRequestDTO } from "../dtos/categories.dtos.js";

export const createTestUser=async(req,res)=>{
    try{
        const base_url="https://api.mercadopago.com";
        const body=req.body;
        const test_user=await axios.post(`${base_url}/users/test_user`,body,{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
        });
        return res.status(200).json({
            message:"User Test successfullly.",
            result:test_user.data,
        });
    }catch(error){
        return res.status(400).json({
            result:null,
            message:`Ocurrio el siguiente error -> ${error.message}`,
        })
    }
}

export const preferencesTest=async(req,res)=>{
    try{
        const base_url="https://api.mercadopago.com";
        const body=req.body;
        const payments=await axios.post(`${base_url}/checkout/preferences`,body,{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
        });
        return res.status(200).json({
            message:"Preferences Test succesfullly.",
            result:payments.data,
        });
    }catch(error){
        return res.status(400).json({
            result:null,
            message:`message error -> ${error.message}`,
        })
    }
};

export const createPayment=async(req,res)=>{
    try{
        const {user}=req;
        const trolley=await trolleyModel.findOne({userId:user._id});

        const items= await Promise.all(
            trolley.detail.map(async(detail)=>{
                const product=await productModel.findById(detail.productId)
                console.log(+product.price.toString())
                return{
                    id:product._id,
                    title:product.name,
                    picture_url:product.photo,
                    quantity:detail.quantity,
                    currency_id:"PEN",
                    unit_price:+product.price.toString(),
                };
            })
        )

        // console.log(trolley);
        // preference > inicializar una proceso de pago
        const preference=await mercadopago.preferences.create({
            auto_return:"approved", // redireccionara automaticamente cuando el pago sea aprobado
            back_urls:{
                success:"http://www.google.com", // indicamos la url si el pago fue exitoso se hara el redireccionamiento
                failure:"http://www.tecsup.edu.pe", // si el pago no fue exitoso  nos reedireccionara aqui
                pending:"http://www.example.com", // si aun no se realizo el pago pro que fue seleccionada la opcion 
                // de otro pago contra entrega o pagoefectivo.
            },
            payer:{
                name:user.name,
                surname:user.lastname,
                // email extraido de la documantacion para el examen que esta en pdf
                // solamente usar este correo cuando se use alguna otra token que no sea la de la
                    // certificacion, mientras tanto usar este correo.
                // test_user_63274575@testuser.com < documentacion de examen
                // user.email < cuando sea mas real en la implmenetacion de nuestro proyecto.
                email:"test_user_63274575@testuser.com",
                // usaremos una por defecto
                address:{       // address < es un campo opcional
                    street_name:user.directions[0]?.street,
                    street_number:+user.directions[0]?.number,
                    // la direction solo sirve para el proceso de facturacion
                    zip_code:"04002",
                }
            },  // informacion de la persona que vaya a pagar
            items,

            // definiendo la url con la cual MercadoPago nos va a comunicar el estado de la cuenta
                // colocamos la url en la cual mercadoPago va a enviar la informacion en tiempo real
                    // sobre esta preferencia.
                    // MP la conoce como IPN (Instant Payment Notification)
            notification_url:"https://521d-190-42-184-88.sa.ngrok.io/mercado-pago-notificaciones",
        })
        // console.log(trolley);
        // console.log(preference);
        // una vez creada la preferencia se limpiara los items del carrito
        trolley.detail=[]
        await trolley.save()
        let total=0;
        // items.forEach(item=>{
        //     total+=item.quantity*item.unit_price;
        // })
        // se podria usar el metodo reduce de los arreglos
        total=items.reduce((pV,cV)=>pV*+(cV.quantity*cV.unit_price),total)
        await orderModel.create({
            date:preference.body.date_created,
            total,
            state:'CREATED',
            preferenceId:preference.body.id,
            userId:user._id,
        })
        return res.status(200).json({
            message:"The link is: ",
            result:preference,
        });
    }catch(error){
        return res.status(400).json({
            message:error.message,
            result:null,
        })
    }
};

export const notificationsMercadoPago=async(req,res)=>{
    console.log("El body es: ")
    console.log(req.body)
    console.log("El parametros son: ")
    console.log(req.params)
    console.log("El query params son: ")
    console.log(req.query)

    // method send() < envia sin ningun body
    return res.status(200).send();
};
