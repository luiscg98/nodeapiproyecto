import { Router, Request, Response, NextFunction } from 'express';
import MongoDBHelper from '../helpers/mongodb.helper';
import mongoClient from 'mongodb';

const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/', async(req:Request, res: Response, next:NextFunction) => {


    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('productos').find().toArray()
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

api.get('/byId/:id', async(req:Request, res: Response, next:NextFunction) => {

    let id = (req.params.id);
    let aid = new mongoClient.ObjectID(id);

    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('productos').findOne({_id: aid})
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

api.post('/byCategory', async(req:Request, res: Response, next:NextFunction) => {

    let desde:any = req.query.desde || 0;
    desde=Number(desde);
    let limite:any = req.query.limite || 10;
    limite=Number(limite);

    const {categorias}=req.body;
    let categoria= new mongoClient.ObjectID(categorias);


    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('productos').find({categoria, disponible:true}).skip(desde).limit(limite).toArray()
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
    let {nombre, descripcion, precioUni, categorias, stocks} = req.body;
    
    let disponible=false;

    let img='no-image.jpg';
    let categoria= new mongoClient.ObjectID(categorias);

    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('productos').insertOne({
        nombre, descripcion, disponible, precioUni, categoria, img, stocks
    })
    .then((result:any) => {
        return {
            ok:true,
            message:"Producto creado con éxito"
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

});


api.put('/edit', async(req: Request, res: Response, next: NextFunction) => {
    let {uid ,nombre, descripcion, precioUni, categorias, stocks} = req.body;
    let disponible=true;
    if(stocks>0){
        disponible=true;
    }
    else{
        disponible=false;
    }
    let categoria= new mongoClient.ObjectID(categorias);
    uid= new mongoClient.ObjectID(uid);
    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('productos').findOneAndUpdate({
        _id:uid
    },
    { $set:{nombre, descripcion, precioUni, categoria, stocks, disponible} })
    .then((result:any) => {
        return {
            ok:true,
            producto:'Productos actualizado con exito'
        }
    })
    .catch((err: any) => {
        return {
            ok:false,
            producto:err
        }
    });


    res.status(200).json({
        ok:result.ok,
        message:result.producto
    })

});

api.put('/alta/:id', async(req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let disponible=true;
    let uid= new mongoClient.ObjectID(id);
    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('productos').findOneAndUpdate({
        _id:uid
    },
    { $set:{disponible} })
    .then((result:any) => {
        return {
            ok:true,
            producto:'Productos actualizado con exito'
        }
    })
    .catch((err: any) => {
        return {
            ok:false,
            producto:err
        }
    });


    res.status(200).json({
        ok:result.ok,
        message:result.producto
    })

});

api.delete('/delete/:id', async(req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let uid= new mongoClient.ObjectID(id);
    let disponible=false;
    mongo.setDataBase('neko_no_kokoro');
    const result: any = await mongo.db.collection('productos').findOneAndUpdate({
        _id:uid
    },
    { $set:{disponible}})
    .then((result:any) => {
        return {
            ok:true,
            message:'Producto dado de baja'
        }
    })
    .catch((err: any) => {
        return {
            ok:false,
            message:err
        }
    });


    res.status(200).json({
        ok:result.ok,
        message:result.message
    })

});

export default api;