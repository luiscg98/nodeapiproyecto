import settings from '../config/settings';
import { MongoClient, MongoClientOptions } from 'mongodb';

export default class MongoDBHelper {

    public db:any;
    public stateConection:string = '';

    private static _instance: MongoDBHelper;
    private cnn:any;
    private dbUri:string;
    constructor(isAuth:boolean = false){
        if(isAuth){
            this.dbUri = `mongodb+srv://${settings.mongodb.username}:${settings.mongodb.password}@cluster0.tjgvd.mongodb.net`;
        }
        else{
            this.dbUri = `mongodb+srv://${settings.mongodb.username}:${settings.mongodb.password}@cluster0.tjgvd.mongodb.net`;
        }
    };

    public static getInstance(isAuth: boolean = false){
        return this._instance || (this._instance = new this(isAuth));
    }

    public async connect(dataBase:string, options: MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology:true }){
        const result = await MongoClient.connect(this.dbUri, options)
        .then((cnn:any)=>{
            return { status:'success', cnn, err:null, mesagge: 'Conexión a MongoDB realizada con éxito'}
        })
        .catch((err: any) => {
            return { status:'error', cnn:null, err, mesagge: 'Error de conexión'}
        });

        if(result.status === 'success'){
            console.log('Servidor MongoDb conectado')
            this.stateConection = result.status;
            this.cnn = result.cnn;
            this.db = this.cnn.db(dataBase);
        } else {
            this.stateConection = result.status;
            this.cnn = null;
            this.db = null;
        }
    }

    public setDataBase(dataBase: string) {
        this.db = this.cnn.db(dataBase);
    }

    public async disconnect(){
        this.cnn.close();
    }
}