
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { insertData } from "../db/insertQuery";
import { verifyClientData,verifyPkBearerToken} from '../validation/verifyFunctions'

const createToken = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
   let tokenReturned: string,
      verifyData:any;
  try {
    const tokenPromise = await verifyPkBearerToken(event.headers.authorization)
    if (event.body != null) {
      verifyData = await verifyClientData(JSON.parse(event.body))
      tokenReturned = await insertData(JSON.parse(event.body),tokenPromise.data)
    } else {
      throw {error:new Error("No hay un objeto data en los parametros"), statusCode:400}
    }
    return{
      statusCode: 200,
      body: JSON.stringify({
        validator: verifyData.message,
        token: tokenReturned
      }) 
    }
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: error.error.message
    }
  }
}

module.exports = {
  createToken
}