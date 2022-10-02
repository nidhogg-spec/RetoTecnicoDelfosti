import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from "aws-lambda";
import { MongoClient, ServerApiVersion } from 'mongodb';
var jwt = require('jsonwebtoken')

const uri = "mongodb+srv://nidhogg:RgKlvHbj5KzsS2Pz@cluster0.yvxcen2.mongodb.net/?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  serverApi: ServerApiVersion.v1
}
const client = new MongoClient(uri, options);
const getData = (token: APIGatewayProxyEventQueryStringParameters) =>{
  return new Promise<any>(async(resolve,reject)=>{
    try {
      const collection = client.db("RetoTecnicoDelfosti").collection("Users");
      const query = {token: token.token}
      const options = {
        projection: { _id: 0, email: 1, card_number: 1, expiration_year: 1, expiration_month: 1,token: 1 },
      };

      collection.findOne(query,options).then((response)=>{
        jwt.verify(token.token,'pk_test_Dt4ZBItXSZT1EzmOd8yCxonL',function(err: any, decoded: any){
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

const getCardData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
  try {
    let cardData: any
    if (event.queryStringParameters != null) {
      cardData = await getData(event.queryStringParameters)
    } else {
      throw new Error("No hay un objeto data en los parametros");
    }
    return{
      statusCode: 200,
      body: JSON.stringify({
        data: cardData
      }) 
    }
  } catch (error) {
    return{
      statusCode: 500,
      body: error.message
    }
  }
  
}

module.exports = {
  getCardData
}