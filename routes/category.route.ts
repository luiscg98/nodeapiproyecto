import { Router, Request, Response, NextFunction } from 'express';
import settings from '../config/settings';
import MongoDBHelper from '../helpers/mongodb.helper';
import mongoClient from 'mongodb';

const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/', async(req:Request, res: Response, next:NextFunction) => {

    let desde:any = req.query.desde || 0;
    desde=Number(desde);
    let limite:any = req.query.limite || 10;
    limite=Number(limite);

    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('categorias').find({disponible:true}).skip(desde).limit(limite).toArray()
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
        categorias:result.productos
    })
});

api.post('/add', async(req: Request, res: Response, next: NextFunction) => {
    let {nombre} = req.body;
    let disponible=true;

    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('categorias').insertOne({
        nombre,disponible
    })
    .then((result:any) => {
        return {
            categoria:result
        }
    })
    .catch((err: any) => {
        console.log(err);
    });


    res.status(201).json({
        ok:true,
        message:"Categoría creada correctamente"
    })

});


api.put('/edit', async(req: Request, res: Response, next: NextFunction) => {
    let {uid ,nombre, descripcion} = req.body;
    uid= new mongoClient.ObjectID(uid);
    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('categorias').findOneAndUpdate({
        _id:uid
    },
    { $set:{nombre, descripcion} })
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
        message:"Categoria actualizada con exito"
    })

});

api.delete('/delete', async(req: Request, res: Response, next: NextFunction) => {
    let {uid} = req.body;
    uid= new mongoClient.ObjectID(uid);
    let disponible:boolean=false;
    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('categorias').findOneAndUpdate({
        _id:uid
    },
    { $set:{disponible}})
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
        message:"Categoría dada de baja con exito"
    })

});

export default api;