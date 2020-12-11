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
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 10;
    limite = Number(limite);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('categorias').find({ disponible: true }).skip(desde).limit(limite).toArray()
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
        categorias: result.productos
    });
}));
api.post('/add', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { nombre } = req.body;
    let disponible = true;
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('categorias').insertOne({
        nombre, disponible
    })
        .then((result) => {
        return {
            categoria: result
        };
    })
        .catch((err) => {
        console.log(err);
    });
    res.status(201).json({
        ok: true,
        message: "Categoría creada correctamente"
    });
}));
api.put('/edit', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { uid, nombre, descripcion } = req.body;
    uid = new mongodb_1.default.ObjectID(uid);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('categorias').findOneAndUpdate({
        _id: uid
    }, { $set: { nombre, descripcion } })
        .then((result) => {
        return {
            producto: result
        };
    })
        .catch((err) => {
        console.log(err);
    });
    res.status(200).json({
        ok: true,
        message: "Categoria actualizada con exito"
    });
}));
api.delete('/delete', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { uid } = req.body;
    uid = new mongodb_1.default.ObjectID(uid);
    let disponible = false;
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('categorias').findOneAndUpdate({
        _id: uid
    }, { $set: { disponible } })
        .then((result) => {
        return {
            producto: result
        };
    })
        .catch((err) => {
        console.log(err);
    });
    res.status(200).json({
        ok: true,
        message: "Categoría dada de baja con exito"
    });
}));
exports.default = api;
