import {describe, expect, test} from '@jest/globals';
const eventGenerator = require('../testUtils/eventGenerator');
const {getCardData} = require('../../controllers/getCardData');
const validators = require('../testUtils/validators');

describe('GET /cardData', () => {
  test('it should take a body and return an API Gateway response', async () =>{
    const event = eventGenerator({
      queryStringObject: {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZm9vYmFyIiwiaWF0IjoxNjY0ODE1MTMxLCJleHAiOjE2NjQ4MTYwMzF9.4LFo9gwtLSeIISnPjD4xvES3R1zFmIQRIoRsL87jpX8"},
    })
    const res = await getCardData(event);
    expect(res).toBeDefined();
    expect(validators.isApiGatewayResponse(res)).toBe(true)
  });
  test('Should return a 200 statusCode if the token is not expired',async ()=>{
    const event = eventGenerator({
      queryStringObject: {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZm9vYmFyIiwiaWF0IjoxNjY0ODE1MTMxLCJleHAiOjE2NjQ4MTYwMzF9.4LFo9gwtLSeIISnPjD4xvES3R1zFmIQRIoRsL87jpX8"},
    })
    const res = await getCardData(event);
    console.log(res)
    expect(res.statusCode).toBe(200);
  })
});
