import express from 'express';
import settings from './config/settings'
import apiProduct from './routes/product.route';
import apiCategory from './routes/category.route';
import apiCar from './routes/car.route';
import apiOrder from './routes/order.route';
import apiUser from './routes/user.route';
import apiImg from './routes/images.routes';
import MongoDBHelper from './helpers/mongodb.helper';
import cors from 'cors';
import fileUpload from 'express-fileupload';

//MongoDB Connect
const mongo = MongoDBHelper.getInstance(true);

//Express App
const app = express();

//Activan los cors, acceso a todas las páginas
app.use(cors());

//Serialization on JSON Format
app.use(express.json());
//File Upload
app.use(fileUpload({
    limits:{fileSize:50*1024*1024},
    useTempFiles: true
}))
//Routes for API
app.use('/product', apiProduct);
app.use('/category', apiCategory);
app.use('/car', apiCar);
app.use('/order', apiOrder);
app.use('/user', apiUser);
app.use('/images', apiImg);

//Start servers
const startServers = async() => {
    await mongo.connect('neko_no_kokoro');

    if(mongo.stateConection === 'success'){
        //Listen Express Server
        app.listen(settings.api.port, () => {
            console.log(`Servidor Express corriendo en puerto ${settings.api.port}`);
        }); 
    }
    else{
        console.log("No se puede arrancar servidor express");
    }
    
}


//Ejecuta los servidores
startServers();
