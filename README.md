## Uso
  Para ejecutar el deploy en serverless primer ejecutar ```npm install``` luego ejecutar el comando ```npm run deploy``` (antes de ejecutar este comando asegurase de ejecutar el comando ```aws configure``` con las credenciales adjuntadas en el correo).

  Para ejecutar las pruebas unitarias ejecutar el comando ```DATABASE_PWD=RgKlvHbj5KzsS2Pz AUTH_KEY=pk_test_Dt4ZBItXSZT1EzmOd8yCxonL npm test```

  Use dos endpoints el POST es para registrar la data de la tarjeta en cual dara como respuesta dos valores uno de si paso las validaciones correctamente y en otro el token de seguridad con vigencia de 15 min.
  POST - https://mf7j95t7s2.execute-api.us-east-1.amazonaws.com/tokens
  En el caso del endpoint tipo get enviar como parametro de la peticion el token obtenido del anterior endpoint
  GET - https://mf7j95t7s2.execute-api.us-east-1.amazonaws.com/cardData?token=token


## Consideraciones
  Asegurase que el valor del header de authenticacion sea el mismo que el de la variable de entorno AUTH_KEY del archivo serverless.yml, solo el valor de la llave sin considerar el prefijo del token, por ejemplo la llave con el prefijo seria `bearer pk_test_Dt4ZBItXSZT1EzmOd8yCxonL` solo asegurar similitud con `pk_test_Dt4ZBItXSZT1EzmOd8yCxonL`. Teniendo en cuenta esto el valor de la variable de entorno seria `AUTH_KEY: pk_test_Dt4ZBItXSZT1EzmOd8yCxonL`.

  En el caso de ls unit test asegurarse de añadirle las variables de entorno antes de ejecutar el npm test como se observa aca en el siguiente ejemplo, de igual manera el header authentication debe ser el mismo para el caso de los test tambien.
  ```DATABASE_PWD=RgKlvHbj5KzsS2Pz AUTH_KEY=pk_test_Dt4ZBItXSZT1EzmOd8yCxonL npm test```