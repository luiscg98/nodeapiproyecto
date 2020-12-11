import { Router, Request, Response, NextFunction } from 'express';
import settings from '../config/settings';
import MongoDBHelper from '../helpers/mongodb.helper';
import mongoClient from 'mongodb';

const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/', async(req:Request, res: Response, next:NextFunction) => {


    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('ordenes').find().toArray()
    .then((result:any) => {
        return {
            ordenes: result
        }
    })
    .catch((err: any) => {
        console.log(err);
    });

    res.status(200).json({
        ok:true,
        ordenes:result.ordenes
    })
});


api.post('/byId', async(req:Request, res: Response, next:NextFunction) => {

    let {carrito,usuario}=req.body;
    carrito= new mongoClient.ObjectID(carrito);
    usuario = new mongoClient.ObjectID(usuario);

    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('carritos').findOne({usuario, carrito}).toArray()
    .then((result:any) => {
        return {
            productos: result
        }
    })
    .catch((err: any) => {
        console.log(err);
    });

    res.status(200).json({
        ok:true,
        productos:result.productos
    })
});

api.post('/add', async(req: Request, res: Response, next: NextFunction) => {
    let {producto, total, accion, usuario} = req.body;
    let disponible=true;
    producto = new mongoClient.ObjectID(producto);
    usuario = new mongoClient.ObjectID(usuario);
    let fecha = new Date();

    mongo.setDataBase('neko_no_kokoro');
    if(accion == 0){
        const result: any = await mongo.db.collection('ordenes').insertOne({
            usuario,disponible,producto,total,fecha
        })
        .then((result:any) => {
            return {
                ok:true,
                message:"Venta realizada con exito"
            }
        })
        .catch((err: any) => {
            return {
                ok:false,
                message:err
            }
        });
        res.status(201).json({
            ok:result.ok,
            message:result.message
        })
    }
    else{
        const result: any = await mongo.db.collection('ordenes').insertOne({
            usuario,disponible,carrito:producto,total,fecha
        })
        .then((result:any) => {
            return {
                ok:true,
                message:"Venta realizada con exito"
            }
        })
        .catch((err: any) => {
            return {
                ok:false,
                message:err
            }
        });
        res.status(201).json({
            ok:result.ok,
            message:result.message
        })
    }
    

});


api.put('/edit', async(req: Request, res: Response, next: NextFunction) => {
    let {cid, producto} = req.body;
    cid = new mongoClient.ObjectID(cid);
    producto= new mongoClient.ObjectID(producto);
    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('carritos').findOneAndUpdate({
        _id:cid
    },
    { $push: { productos: producto } })
    .then((result:any) => {
        return {
            producto:result
        }
    })
    .catch((err: any) => {
        console.log(err);
    });


    res.status(200).json({
        ok:true,
        message:"Producto agregado al carrito"
    })

});

api.delete('/delete', async(req: Request, res: Response, next: NextFunction) => {
    let {cid, producto} = req.body;
    cid= new mongoClient.ObjectID(cid);
    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('carritos').findOne({
        _id:cid
    })
    .then((result:any) => {
        console.log(result);
        let carrito=result;
        carrito.productos[producto]=null;
        console.log(carrito.productos[producto]);
        mongo.db.collection('carritos').save(carrito,(err:any,result:any) => {
            if(err){
                console.log(err)
            }
            console.log("entro");
        });
    })
    .catch((err: any) => {
        return{
            ok: false,
            message: err
        }
    });


    res.status(200).json({
        ok:result.ok,
        message:result.message
    })

});

export default api;