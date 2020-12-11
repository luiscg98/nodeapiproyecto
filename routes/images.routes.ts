import { Router, Request, Response, NextFunction } from 'express';
import MongoDBHelper from '../helpers/mongodb.helper';
import path from 'path';
import fs from 'fs';


const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/:tipo/:img', (req:Request, res: Response, next:NextFunction) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let noImagePath = path.resolve(__dirname, '../uploads/no-image.jpg');

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(noImagePath);
    }

});



export default api;