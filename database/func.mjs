import { database as db } from "./db.mjs";

// Escrever dados
async function write(index, data) {
    if (!index || data === undefined) {
    throw new Error("Nó ou o dado informado não é válido ou não existe");
    }
    await db.ref(index).set(data);
}

// Ler dados
async function read(index) {
    if (!index) throw new Error("Nó informado não é válido ou não existe");

    const snapshot = await db.ref(index).once("value");
    return snapshot.exists() ? snapshot.val() : null;
}

// Atualizar dados
async function updateData(index, data) {
    if (!index || !data) throw new Error("Nó ou o dado informado não é válido ou não existe");
    await db.ref(index).update(data);
}

// Remover dados
async function removeData(index) {
    if (!index) throw new Error("Nó informado não é válido ou não existe");
    await db.ref(index).remove();
}

// Adicionar dados com ID automático
async function addData(index, data) {
    if (!index || !data) throw new Error("Nó ou o dado informado não é válido ou não existe");

    const novaRef = db.ref(index).push();
    await novaRef.set(data);
    return novaRef.key;
}

// Escutar alterações em tempo real
async function listen(index, callback) {
    if (!index || !callback) throw new Error("Nó ou o callback informado não é válido ou não existe");

    db.ref(index).on("value", (snapshot) => {
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
