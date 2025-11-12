import { database } from "./database/func.mjs";

try {
    //Teste de como apreender a mexer com o banco de dados firebase
    // const dbRef = ref(db, "/ping");

    // const before = Date.now(); // Início da medição de latência
    // const snapshot = await get(dbRef);
    // const after = Date.now(); // Fim da medição de latência
    // const ping = after - before; // Valor da latência em milissegundos

    // if ( !snapshot.exists() ) console.log("Dado não existente"); // Verificar se existe dados
    
    // const data = snapshot.val(); // Recuperação do valor do dado
    // console.log("Sucesso ao logar!");
    // console.log(`${data} ${ping}ms`);


    //Teste de como ler os dados do banco de dados firebase 
    // const before = Date.now();
    // const data = await database.read("/ping");
    // const after = Date.now();
    // const ping = after - before;
    
    // console.log("Sucesso ao logar na firebase!");

    // if( data ) console.log(`${data} ${ping}ms`); else console.log("Dado não existente");

    // //Teste de como escrever os dados no banco de dados firebase
    // await database.write("/hello", "Hello, Firebase!");// /hello é o nó onde o dado será escrito a mensagem e "Hello, Firebase!" é o dado que será escrito

    // Função para mostrar mensagem
    function mostrarMensagem(texto) {
    const elemento = document.getElementById("mensagem");
    elemento.textContent = texto;
    }

    // Executa ao carregar
    mostrarMensagem("Olá, esta é uma mensagem vinda do arquivo .mjs!");
    
} catch ( e ) {
    console.log("Erro ao logar na firebase:", e);
}