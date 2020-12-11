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
const express_1 = require("express");
const mongodb_helper_1 = __importDefault(require("../helpers/mongodb.helper"));
const mongodb_1 = __importDefault(require("mongodb"));
const api = express_1.Router();
const mongo = mongodb_helper_1.default.getInstance();
api.post('/byId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { usuario } = req.body;
    usuario = new mongodb_1.default.ObjectID(usuario);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('carritos').findOne({ usuario, disponible: true })
        .then((result) => {
        return {
            ok: true,
            productos: result
        };
    })
        .catch((err) => {
        console.log(err);
    });
    res.status(200).json({
        ok: true,
        productos: result.productos
    });
}));
api.post('/add', (req, res, next) => {
    let { producto, usuario } = req.body;
    let disponible = true;
    producto = new mongodb_1.default.ObjectID(producto);
    usuario = new mongodb_1.default.ObjectID(usuario);
    mongo.setDataBase('neko_no_kokoro');
    mongo.db.collection('carritos').insertOne({
        disponible, productos: [producto], usuario
    })
        .then((result) => {
        let i = result.ops;
        i = i[0]._id;
        i = new mongodb_1.default.ObjectID(i);
        mongo.db.collection('usuarios').findOneAndUpdate({
            _id: usuario
        }, { $set: { carrito: i, carritoflag: true } })
            .then((result) => {
            return res.status(200).json({
                ok: true,
                message: 'Producto agregado al carrito'
            });
        })
            .catch((err) => {
            return res.status(200).json({
                ok: false,
                message: err
            });
        });
    })
        .catch((err) => {
        return res.status(200).json({
            ok: false,
            message: err
        });
    });
});
api.put('/edit', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { cid, producto } = req.body;
    cid = new mongodb_1.default.ObjectID(cid);
    producto = new mongodb_1.default.ObjectID(producto);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('carritos').findOneAndUpdate({
        _id: cid
    }, { $push: { productos: producto } })
        .then((result) => {
        return {
            ok: true,
            message: "Producto agregado al carrito"
        };
    })
        .catch((err) => {
        return {
            ok: true,
            message: err
        };
    });
    res.status(200).json({
        ok: result.ok,
        message: result.message
    });
}));
api.put('/borrarCarrito', (req, res, next) => {
    let { cid, usuario } = req.body;
    console.log(cid);
    cid = new mongodb_1.default.ObjectID(cid);
    usuario = new mongodb_1.default.ObjectID(usuario);
    mongo.setDataBase('neko_no_kokoro');
    mongo.db.collection('carritos').findOneAndUpdate({
        _id: cid
    }, { $set: { disponible: false } })
        .then((result) => {
        mongo.db.collection('usuarios').findOneAndUpdate({
            _id: usuario
        }, { $set: { carrito: null, carritoflag: false } })
            .then((result) => {
            res.status(200).json({
                ok: true,
                message: 'Carrito eliminado correctamente'
            });
        });
    })
        .catch((err) => {
        res.status(401).json({
            ok: false,
            message: 'Error en el servidor'
        });
    });
});
api.delete('/delete', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { cid, producto } = req.body;
    cid = new mongodb_1.default.ObjectID(cid);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('carritos').findOne({
        _id: cid
    })
        .then((result) => {
        console.log(result);
        let carrito = result;
        carrito.productos[producto] = null;
        console.log(carrito.productos[producto]);
        mongo.db.collection('carritos').save(carrito, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("entro");
        });
    })
        .catch((err) => {
        return {
            ok: false,
            message: err
        };
    });
    res.status(200).json({
        ok: result.ok,
        message: result.message
    });
}));
exports.default = api;
