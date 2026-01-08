import { ref, set, get, update, remove, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";
import { database as db } from "./db.mjs"; 

// Escrever dados
async function write(index, data) {
    if (!index || data === undefined) {
        throw new Error("Nó ou o dado informado não é válido ou não existe");
    }
    await set(ref(db, index), data);
}

// Ler dados
async function read(index) {
    if (!index) throw new Error("Nó informado não é válido ou não existe");

    const snapshot = await get(ref(db, index));
    return snapshot.exists() ? snapshot.val() : null;
}

// Atualizar dados
async function updateData(index, data) {
    if (!index || !data) throw new Error("Nó ou o dado informado não é válido ou não existe");
    await update(ref(db, index), data);
}

// Remover dados
async function removeData(index) {
    if (!index) throw new Error("Nó informado não é válido ou não existe");
    await remove(ref(db, index));
}

// Adicionar dados com ID automático
async function addData(index, data) {
    if (!index || !data) throw new Error("Nó ou o dado informado não é válido ou não existe");

    const novaRef = push(ref(db, index));
    await set(novaRef, data);
    return novaRef.key;
}

// Escutar alterações em tempo real
async function listen(index, callback) {
    if (!index || !callback) throw new Error("Nó ou o callback informado não é válido ou não existe");

    onValue(ref(db, index), (snapshot) => {
        callback(snapshot.exists() ? snapshot.val() : null);
    });
}

export const database = {
    write,
    read,
    updateData,
    removeData,
    addData,
    listen
};
