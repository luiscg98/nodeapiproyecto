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
const settings_1 = __importDefault(require("../config/settings"));
const mongodb_1 = require("mongodb");
class MongoDBHelper {
    constructor(isAuth = false) {
        this.stateConection = '';
        if (isAuth) {
            this.dbUri = `mongodb+srv://${settings_1.default.mongodb.username}:${settings_1.default.mongodb.password}@cluster0.tjgvd.mongodb.net`;
        }
        else {
            this.dbUri = `mongodb+srv://${settings_1.default.mongodb.username}:${settings_1.default.mongodb.password}@cluster0.tjgvd.mongodb.net`;
        }
    }
    ;
    static getInstance(isAuth = false) {
        return this._instance || (this._instance = new this(isAuth));
    }
    connect(dataBase, options = { useNewUrlParser: true, useUnifiedTopology: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.MongoClient.connect(this.dbUri, options)
                .then((cnn) => {
                return { status: 'success', cnn, err: null, mesagge: 'Conexión a MongoDB realizada con éxito' };
            })
                .catch((err) => {
                return { status: 'error', cnn: null, err, mesagge: 'Error de conexión' };
            });
            if (result.status === 'success') {
                console.log('Servidor MongoDb conectado');
                this.stateConection = result.status;
                this.cnn = result.cnn;
                this.db = this.cnn.db(dataBase);
            }
            else {
                this.stateConection = result.status;
                this.cnn = null;
                this.db = null;
            }
        });
    }
    setDataBase(dataBase) {
        this.db = this.cnn.db(dataBase);
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cnn.close();
        });
    }
}
exports.default = MongoDBHelper;
