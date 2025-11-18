import { get, set, ref, update, remove, push} from "firebase/database"; //funções que iram ser importantes: push e onValue (código essencial para cada coisa)
import { db } from "./db.mjs";

async function write(index, data) {
    if (!index || !data) throw new Error("Nó ou o dado informado não é válido ou não existe");
    
    const dbRef = ref(db, index);// ref é uma funcao que cria uma referencia para escrever no diretorio especifico (neste caso o index)
    await set(dbRef, data); //await é a funcao que espera o preenchimento da promise (promise é um valor de uma variavel do futuro)
    // set é uma funcao que escreve o dado no diretorio especifico
}

async function read(index) {
    if (!index) throw new Error("Nó informado não é válido ou não existe");

    const dbRef = ref(db, index);
    const snapshot = await get(dbRef);//get é a função que lê os dados uma vez

    if (snapshot.exists()) { //snapshot é a forma de como a firebase vai me entregar os dados (.exist verifica se existe alguma coisa)
        return snapshot.val();//.val vai retornar o valor
    }

    return null;
}

async function updateData(index, data) {
    if (!index || !data) throw new Error("Nó ou o dado informado não é válido ou não existe");
    
    const dbRef = ref(db, index);
    await update(dbRef, data);
}

async function removeData(index) {
    if (!index) throw new Error("Nó ou o dado informado não é válido ou não existe");
    
    const dbRef = ref(db, index);
    await remove(dbRef);
}

async function addData(index, data) {
    if (!index || !data) throw new Error("Nó ou o dado informado não é válido ou não existe");
    
    const dbRef = ref(db, index);
    const listaNova = push(dbRef);
    await set(listaNova, data);
}

export const database = {
    write,
    read,
    updateData,
    removeData,
    addData
}