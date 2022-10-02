
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { MongoClient, ServerApiVersion } from 'mongodb';
var jwt = require('jsonwebtoken');

const email_key= process.env.EMAIL_VALIDATOR_KEY;

const uri = "mongodb+srv://nidhogg:RgKlvHbj5KzsS2Pz@cluster0.yvxcen2.mongodb.net/?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  serverApi: ServerApiVersion.v1
}
const client = new MongoClient(uri, options);

interface ClientData {
  email: string,
  card_number: number ,
  cvv: number,
  expiration_year: string,
  expiration_month: string
}

var luhnChk = (function (arr) {
  return function (ccNum: string) {
      var 
          len = ccNum.length,
          bit = 1,
          sum = 0,
          val: number;

      while (len) {
          val = parseInt(ccNum.charAt(--len), 10);
          sum += (bit ^= 1) ? arr[val] : val;
      }

      return sum && sum % 10 === 0;
  };
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

// Validate each function with a unit test
function verifyCardNumber(card_number:string){
  return new Promise<void>((resolve,reject)=>{
    let count = 0;

    for (var i = 0, len = card_number.length; i < len; i++) {
      if (card_number[i] !== ' '){
        count++;
      } 
    }
    if (count >= 13 && count <= 16 ) {
      const isLuhnCheckPassed = luhnChk(card_number.split(/[- ]/g).join(''));

      isLuhnCheckPassed ? resolve() : reject(new Error('Numero de tarjeta invalido.'));
    } else {
      reject(new Error('Numero de digitos invalido debe tener entre 13 y 16 digitos.'));
    }
  });
}

function verifyCVV(cvv:string){
  return new Promise<void>((resolve,reject)=>{
    const regExPattern:RegExp = /^[0-9]{3,4}$/g

    regExPattern.test(cvv) ? resolve() : reject(new Error('CVV invalido.'));
  });

}

function verifyExpMonth(expiration_month:string){
  return new Promise<void>((resolve,reject)=>{
    const regExPattern: RegExp = /\b(0[1-9]|1[0-2])\b/g

    regExPattern.test(expiration_month) ? resolve() : reject(new Error('Por favor, ingresa un mes valido con el format 01.'));
  });
}

function verifyExpYear(expiration_year:string){
  return new Promise<void>((resolve,reject)=>{
    const regExPattern: RegExp = /^\d{4}$\b/g,
    maxYear = new Date().getFullYear() + 5,
    regExpTest = regExPattern.test(expiration_year);
   
    if (regExpTest) {
      if (parseInt(expiration_year) <= maxYear) {
        resolve();
      } else {
        reject(new Error('Fecha de expiración vencida.'));
      }
    } else {
      reject(new Error('Ingrese un numero de año valido con el formate de 4 digitos (2015).'));
    }
  });
}

function verifyEmail(email:string){
  return new Promise<void>((resolve,reject)=>{
    const getDomain = email.split('@')

    if (getDomain[1]) {
      if (getDomain[1] == 'gmail.com' || getDomain[1] == 'hotmail.com' || getDomain[1] == 'yahoo.es')   {
        resolve();
      } else {
        reject(new Error('Ingrese un dominio valido entre (gmail.com,hotmail.com,yahoo.es).'));
      }
    } else {
      reject(new Error('Email invalido, porfavor ingrese un email valido.'));
    }
  });
}

var verifyClientData = (data:any)=>{
  return new Promise<string>(async(resolve,reject)=>{
    try {
      await verifyCardNumber(data.card_number);
      await verifyCVV(data.cvv);
      await verifyExpMonth(data.expiration_month);
      await verifyExpYear(data.expiration_year);
      await verifyEmail(data.email);
      resolve('Ok');
    } catch (error) {
      reject(error);
    } 
  })
  
}

var verifyPkBearerToken = (authorization: string | undefined) =>{
  return new Promise<string>(async(resolve,reject)=>{
    if (authorization !== undefined) {
      const validToken = authorization.split(' ')
      resolve(validToken[1]);
    } else {
      reject(new Error('pk Token inexistente'));
    }
  })
}

const add = (data:ClientData,pkData:string) =>{
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

const createToken = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
  try {
    
    let addMongo: any,
      verifyData:any;

    const tokenPromise:string = await verifyPkBearerToken(event.headers.authorization)

    if (event.body != null) {
      addMongo = await add(JSON.parse(event.body),tokenPromise)
      verifyData = await verifyClientData(JSON.parse(event.body))
    } else {
      throw new Error("No hay un objeto data en los parametros");
    }
    return{
      statusCode: 200,
      body: JSON.stringify({
        validator: verifyData,
        token: tokenPromise,
        mongo: addMongo
      }) 
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message
    }
  }
 
}

module.exports = {
  createToken
}