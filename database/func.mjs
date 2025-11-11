import { get, set, ref} from "firebase/database";
import { db } from "./db.mjs";

async function write(index, data) {
    if (!index || !data) throw new Error("Nó ou o dado informado não é válido ou não existe");
    
    const dbRef = ref(db, index);// ref é uma funcao que cria uma referencia para escrever no diretorio especifico (neste caso o index)
    await set(dbRef, data); //await é a funcao que espera o preenchimento da promise (promise é um valor de uma variavel do futuro) )
    // set é uma funcao que escreve o dado no diretorio especifico
}

async function read(index) {
    if (!index) throw new Error("Nó informado não é válido ou não existe");

    const dbRef = ref(db, index);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
        return snapshot.val();
    }

    return null;
}

export const database = {
    write,
    read
}