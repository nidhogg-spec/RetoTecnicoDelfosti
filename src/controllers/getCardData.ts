import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getData } from "../db/insertQuery";

const getCardData = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
  try {
    let cardData: any
    if (event.queryStringParameters != null) {
      cardData = await getData(event.queryStringParameters)
    } else {
      throw {error: new Error("No hay un objeto data en los parametros"), statusCode:400}
    }
    return{
      statusCode: 200,
      body: JSON.stringify({
        data: cardData
      }) 
    }
  } catch (error) {
    return{
      statusCode: error.statusCode,
      body: error.error.message
    }
  }
  
}

module.exports = {
  getCardData
}