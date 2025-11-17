import { database } from "./database/func.mjs";

try {

  const before = Date.now();
  const data = await database.read("/ping");
  const after = Date.now();
  const ping = after - before;
    
  console.log("Sucesso ao logar na firebase!");

  if( data ) console.log(`${data} ${ping}ms`); else console.log("Dado não existente");

  await database.write("/hello", "Hello, Firebase!");

  console.log("Dados escritos com sucesso!");
    
} catch ( e ) {
    console.log("Erro ao logar na firebase:", e);
}