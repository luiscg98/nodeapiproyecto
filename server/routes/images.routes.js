"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongodb_helper_1 = __importDefault(require("../helpers/mongodb.helper"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const api = express_1.Router();
const mongo = mongodb_helper_1.default.getInstance();
api.get('/:tipo/:img', (req, res, next) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let noImagePath = path_1.default.resolve(__dirname, '../uploads/no-image.jpg');
    let pathImagen = path_1.default.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs_1.default.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    }
    else {
        res.sendFile(noImagePath);
    }
});
exports.default = api;
