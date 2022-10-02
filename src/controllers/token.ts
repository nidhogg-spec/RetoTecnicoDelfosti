
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { insertData } from "../db/insertQuery";
import { verifyClientData,verifyPkBearerToken} from '../validation/verifyFunctions'

const createToken = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
  try {
    let addMongo: any,
      verifyData:any;

    const tokenPromise:string = await verifyPkBearerToken(event.headers.authorization)

    if (event.body != null) {
      addMongo = await insertData(JSON.parse(event.body),tokenPromise)
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