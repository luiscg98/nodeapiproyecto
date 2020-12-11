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
api.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('productos').find().toArray()
        .then((result) => {
        return {
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
api.get('/byId/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = (req.params.id);
    let aid = new mongodb_1.default.ObjectID(id);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('productos').findOne({ _id: aid })
        .then((result) => {
        return {
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
api.post('/byCategory', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 10;
    limite = Number(limite);
    const { categorias } = req.body;
    let categoria = new mongodb_1.default.ObjectID(categorias);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('productos').find({ categoria, disponible: true }).skip(desde).limit(limite).toArray()
        .then((result) => {
        return {
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
api.post('/add', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { nombre, descripcion, precioUni, categorias, stocks } = req.body;
    let disponible = false;
    let img = 'no-image.jpg';
    let categoria = new mongodb_1.default.ObjectID(categorias);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('productos').insertOne({
        nombre, descripcion, disponible, precioUni, categoria, img, stocks
    })
        .then((result) => {
        return {
            ok: true,
            message: "Producto creado con éxito"
        };
    })
        .catch((err) => {
        return {
            ok: false,
            message: err
        };
    });
    res.status(201).json({
        ok: result.ok,
        message: result.message
    });
}));
api.put('/edit', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { uid, nombre, descripcion, precioUni, categorias, stocks } = req.body;
    let disponible = true;
    if (stocks > 0) {
        disponible = true;
    }
    else {
        disponible = false;
    }
    let categoria = new mongodb_1.default.ObjectID(categorias);
    uid = new mongodb_1.default.ObjectID(uid);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('productos').findOneAndUpdate({
        _id: uid
    }, { $set: { nombre, descripcion, precioUni, categoria, stocks, disponible } })
        .then((result) => {
        return {
            ok: true,
            producto: 'Productos actualizado con exito'
        };
    })
        .catch((err) => {
        return {
            ok: false,
            producto: err
        };
    });
    res.status(200).json({
        ok: result.ok,
        message: result.producto
    });
}));
api.put('/alta/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let disponible = true;
    let uid = new mongodb_1.default.ObjectID(id);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('productos').findOneAndUpdate({
        _id: uid
    }, { $set: { disponible } })
        .then((result) => {
        return {
            ok: true,
            producto: 'Productos actualizado con exito'
        };
    })
        .catch((err) => {
        return {
            ok: false,
            producto: err
        };
    });
    res.status(200).json({
        ok: result.ok,
        message: result.producto
    });
}));
api.delete('/delete/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let uid = new mongodb_1.default.ObjectID(id);
    let disponible = false;
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('productos').findOneAndUpdate({
        _id: uid
    }, { $set: { disponible } })
        .then((result) => {
        return {
            ok: true,
            message: 'Producto dado de baja'
        };
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
