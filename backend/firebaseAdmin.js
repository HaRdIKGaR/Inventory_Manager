// firebaseAdmin.js
import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync("./ServiceAccountKey.json", "utf8") // 🔐 Use your downloaded Firebase service account JSON
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
