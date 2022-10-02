import {ClientData} from '../Interfaces/clientData';
import { MongoClient, ServerApiVersion } from 'mongodb';

var jwt = require('jsonwebtoken');
const dbPWD = process.env.DATABASE_PWD;
const authKey = process.env.AUTH_KEY;
const uri = `mongodb+srv://nidhogg:${dbPWD}@cluster0.yvxcen2.mongodb.net/?retryWrites=true&w=majority`;
const options = {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  serverApi: ServerApiVersion.v1
}

const client = new MongoClient(uri, options);

export const insertData = (data:ClientData,pkData:string) =>{
  return new Promise<any>(async(resolve,reject)=>{
    try {
      await client.connect();
      const token = jwt.sign({data: 'foobar'},pkData,{ expiresIn: 100 * 9 });
      const collection = client.db("RetoTecnicoDelfosti").collection("Users");
      const documentData = {
        card_number: data.card_number,
        cvv: data.cvv,
        expiration_month: data.expiration_month,
        expiration_year: data.expiration_year,
        email: data.email,
        token: token
      }
      collection.insertOne(documentData).then((result)=>{
        client.close()
        resolve(result.insertedId)

      });
    } catch (error) {
      reject(new Error(error))
    }
  });
}
export const getData = (token: any) =>{
  return new Promise<any>(async(resolve,reject)=>{
    try {
      const collection = client.db("RetoTecnicoDelfosti").collection("Users");
      const query = {token: token.token}
      const options = {
        projection: { _id: 0, email: 1, card_number: 1, expiration_year: 1, expiration_month: 1,token: 1 },
      };

      collection.findOne(query,options).then((response)=>{
        jwt.verify(token.token,authKey,function(err: any, decoded: any){
          if (err) {
            reject(new Error(err))
          }else{
            client.close()
            resolve(response);
          }
        })
      })
    } catch (error) {
      reject(new Error(error))
    }
  });
}