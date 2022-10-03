import {describe, expect, test} from '@jest/globals';
import { verifyClientData } from '../validation/verifyFunctions';
import { verifyPkBearerToken } from '../validation/verifyFunctions';

const createToken = require('./token');

test('Exist Validation token',async()=>{
  const res = await verifyPkBearerToken('bearer test1');
  expect(res.statusCode).toBe(202);
});

test('Validation of user input is working',async()=>{
  const res = await verifyClientData({email: "test@gmail.com",card_number: "4557880421617964",cvv: "456",expiration_year: "2025",expiration_month: "09"});
  expect(res.statusCode).toBe(202)
});

test('Responses is an Object',()=>{
  expect(typeof createToken).toBe('object')
})