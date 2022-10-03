import {describe, expect, test} from '@jest/globals';
const eventGenerator = require('../testUtils/eventGenerator')
const validators = require('../testUtils/validators')
const {createToken} = require( '../../controllers/token');

describe('POST /token', () => {
  test('it should take a body and return an API Gateway response', async () =>{
    const event = eventGenerator({
      body: {email: "test@gmail.com",card_number: "4557880421617964",cvv: "456",expiration_year: "2025",expiration_month: "09"},
      headers: {authorization:'bearer pk_test_Dt4ZBItXSZT1EzmOd8yCxonL'}
    })
    const res = await createToken(event);
    expect(res).toBeDefined();
    expect(validators.isApiGatewayResponse(res)).toBe(true)
  });
  test('Should return a 200 statusCode if the card is valid',async ()=>{
    const event = eventGenerator({
      body: {email: "test@gmail.com",card_number: "4557880421617964",cvv: "456",expiration_year: "2025",expiration_month: "09"},
      headers: {authorization:'bearer pk_test_Dt4ZBItXSZT1EzmOd8yCxonL'}
    })
    const res = await createToken(event);
    expect(res.statusCode).toBe(200);
  })
});
