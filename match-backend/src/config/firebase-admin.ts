import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = require('../../ServiceAccountKey.json');

// Initialize if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// Export auth instance
export const auth = getAuth();
