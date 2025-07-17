import dotenv from 'dotenv';
dotenv.config();

import admin from 'firebase-admin';

const rawServiceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Fix private_key line breaks for Firebase
rawServiceAccount.private_key = rawServiceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(rawServiceAccount),
});

export default admin;
