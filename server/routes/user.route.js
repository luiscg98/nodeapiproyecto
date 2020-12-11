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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const api = express_1.Router();
const mongo = mongodb_helper_1.default.getInstance();
api.put('/edit', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { direccion, cp, telefono, id } = req.body;
    id = new mongodb_1.default.ObjectID(id);
    mongo.setDataBase('neko_no_kokoro');
    const result = yield mongo.db.collection('usuarios').findOneAndUpdate({
        _id: id
    }, { $set: { direccion, cp, telefono } })
        .then((result) => {
        return {
            ok: true,
            producto: 'Usuario actualizado con exito'
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
api.post('/upload/:tipo/:id', (req, res, next) => {
    let tipo = req.params.tipo;
    let idstring = req.params.id;
    let id = new mongodb_1.default.ObjectID(idstring);
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se ha seleccionado ni un archivo"
            }
        });
    }
    let tipposValidos = ['productos', 'usuarios'];
    if (tipposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Los tipos permitidos son " + tipposValidos.join(',')
            }
        });
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Las extensiones permitidas son " + extensionesValidas.join(','),
                ex: extension
            }
        });
    }
    let nombreArchivo = `${idstring}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo == 'usuarios') {
            //imagenUsuario(id, res, nombreArchivo);
        }
        else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});
function imagenProducto(id, res, nombreArchivo) {
    mongo.db.collection('productos').findOne({ _id: id }).then((result) => {
        borraArchivo(result.img, 'productos');
        mongo.db.collection('productos').findOneAndUpdate({
            _id: result._id
        }, { $set: { img: nombreArchivo } }).then((result) => {
            return res.status(200).json({
                ok: true,
                message: "Imagen cargada correctamente"
            });
        });
    }).catch((err) => {
        borraArchivo(nombreArchivo, 'productos');
        return res.status(500).json({
            ok: false,
            message: "Hubo un error con el servidor"
        });
    });
}
function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs_1.default.existsSync(pathImagen)) {
        fs_1.default.unlinkSync(pathImagen);
    }
}
exports.default = api;
