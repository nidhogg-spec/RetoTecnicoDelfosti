import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from "aws-lambda";
import { getData } from "../db/insertQuery";

const dbPWD = process.env.DATABASE_PWD;

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