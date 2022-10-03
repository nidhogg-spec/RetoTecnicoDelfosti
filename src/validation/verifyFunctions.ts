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

export var verifyPkBearerToken = (authorization: string | undefined) =>{
  return new Promise<any>(async(resolve,reject)=>{
    if (authorization !== undefined) {
      const validToken = authorization?.split(' ')
      resolve({data:validToken[1],statusCode:202});
    } else {
      reject({error: new Error('pk Token inexistente'), statusCode:417});
    }
  })
}

export var verifyClientData = (data:any)=>{
  return new Promise<any>(async(resolve,reject)=>{
    try {
      await verifyCardNumber(data.card_number);
      await verifyCVV(data.cvv);
      await verifyExpMonth(data.expiration_month);
      await verifyExpYear(data.expiration_year);
      await verifyEmail(data.email);
      resolve({message:'Ok',statusCode:202});
    } catch (error) {
      reject({error: error,statusCode:400});
    } 
  })
  
}