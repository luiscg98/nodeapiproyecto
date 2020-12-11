"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settings_1 = __importDefault(require("./config/settings"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const car_route_1 = __importDefault(require("./routes/car.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const images_routes_1 = __importDefault(require("./routes/images.routes"));
const mongodb_helper_1 = __importDefault(require("./helpers/mongodb.helper"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
//MongoDB Connect
const mongo = mongodb_helper_1.default.getInstance(true);
//Express App
const app = express_1.default();
//Activan los cors, acceso a todas las páginas
app.use(cors_1.default());
//Serialization on JSON Format
app.use(express_1.default.json());
//File Upload
app.use(express_fileupload_1.default({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true
}));
//Routes for API
app.use('/product', product_route_1.default);
app.use('/category', category_route_1.default);
app.use('/car', car_route_1.default);
app.use('/order', order_route_1.default);
app.use('/user', user_route_1.default);
app.use('/images', images_routes_1.default);
//Start servers
const startServers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongo.connect('neko_no_kokoro');
    if (mongo.stateConection === 'success') {
        //Listen Express Server
        app.listen(settings_1.default.api.port, () => {
            console.log(`Servidor Express corriendo en puerto ${settings_1.default.api.port}`);
        });
    }
    else {
        console.log("No se puede arrancar servidor express");
    }
});
//Ejecuta los servidores
startServers();
