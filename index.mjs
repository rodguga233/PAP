import { database } from "./database/func.mjs";

try {

  const before = Date.now();
  const data = await database.read("/ping");
  const after = Date.now();
  const ping = after - before;
    
  console.log("Sucesso ao logar na firebase!");

  if( data ) console.log(`${data} ${ping}ms`); else console.log("Dado não existente");
  
  const agora = new Date();
  const query = await database.addData("/mensagem",
    {
      texto: "teste de mensagem",
      Criado_em: agora.toLocaleString("pt-PT")
    }
  );

  const no = "/mensagem/" + query;
  console.log("Nó criado:", no);

  await database.listen(no, (dados) => {
    console.log("Dados atualizados:", dados);
  });
    
} catch ( e ) {
    console.log("Erro ao logar na firebase:", e);
}