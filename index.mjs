import { db } from "./database/db.mjs";
import { get, ref } from "firebase/database";

try {
    const dbRef = ref(db, "/ping");
    const snapshot = await get(dbRef);
    if ( !snapshot.exists() ) console.log("Dado não existente");
    const data = snapshot.val();
    console.log("Sucesso ao logar!");
    console.log(data);
} catch ( error ) {
    console.log("Erro ao logar na firebase:", error);
}