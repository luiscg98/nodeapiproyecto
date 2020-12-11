import { Router, Request, Response, NextFunction } from 'express';
import settings from '../config/settings';
import MongoDBHelper from '../helpers/mongodb.helper';
import mongoClient from 'mongodb';
import  jwt_decode from 'jwt-decode';

const api = Router();
const mongo = MongoDBHelper.getInstance();

api.post('/byId', async(req:Request, res: Response, next:NextFunction) => {

    let {usuario}=req.body;
    usuario = new mongoClient.ObjectID(usuario);

    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('carritos').findOne({usuario, disponible:true})
    .then((result:any) => {
        return {
            ok:true,
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

api.post('/add', (req: Request, res: Response, next: NextFunction) => {
    let {producto, usuario} = req.body;
    let disponible=true;
    producto = new mongoClient.ObjectID(producto);
    usuario = new mongoClient.ObjectID(usuario);

    mongo.setDataBase('neko_no_kokoro');
    mongo.db.collection('carritos').insertOne({
        disponible, productos:[producto], usuario
    })
    .then((result:any) => {
        let i = result.ops;
        i=i[0]._id;
        i = new mongoClient.ObjectID(i);
        mongo.db.collection('usuarios').findOneAndUpdate({
            _id:usuario
        },
        { $set:{carrito:i, carritoflag:true} })
        .then((result:any) => {
            return res.status(200).json({
                ok:true,
                message:'Producto agregado al carrito'
            })
        })
        .catch((err: any) => {
            return res.status(200).json({
                ok:false,
                message:err
            })
        });
    })
    .catch((err: any) => {
        return res.status(200).json({
            ok:false,
            message:err
        })
    });


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
            ok:true,
            message:"Producto agregado al carrito"
        }
    })
    .catch((err: any) => {
        return {
            ok:true,
            message:err
        }
    });


    res.status(200).json({
        ok:result.ok,
        message:result.message
    })

});

api.put('/borrarCarrito', (req: Request, res: Response, next: NextFunction) => {
    let {cid, usuario} = req.body;
    console.log(cid)
    cid = new mongoClient.ObjectID(cid);
    usuario= new mongoClient.ObjectID(usuario);
    mongo.setDataBase('neko_no_kokoro');
    mongo.db.collection('carritos').findOneAndUpdate({
        _id:cid
    },
    { $set: {disponible:false} })
    .then((result:any) => {
        mongo.db.collection('usuarios').findOneAndUpdate({
            _id:usuario
        },
        {$set:{carrito:null, carritoflag:false}})
        .then((result:any)=>{
            res.status(200).json({
                ok:true,
                message:'Carrito eliminado correctamente'
            })
        })
    })
    .catch((err: any) => {
        res.status(401).json({
            ok:false,
            message:'Error en el servidor'
        })
    });



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