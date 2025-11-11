import { initializeApp } from "firebase/app";
import {config } from "dotenv"; config();
import { getDatabase } from "firebase/database";

const { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } = process.env;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);