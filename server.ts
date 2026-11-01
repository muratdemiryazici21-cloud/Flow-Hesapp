import express from 'express';
import { createServer } from 'vite';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin
// In production, this uses default credentials from the environment.
if (!getApps().length) {
    initializeApp();
}
const admin = {
    auth: () => require('firebase-admin/auth').getAuth(),
    firestore: () => require('firebase-admin/firestore').getFirestore(),
};

const app = express();
app.use(express.json());

import crypto from 'crypto';

// Helper for S256 challenge verification
function sha256(str: string) {
    return crypto.createHash('sha256').update(str).digest('base64url');
}

// API Routes
app.post('/api/flowbrowser/authorize', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send('Unauthorized');
    const token = authHeader.split('Bearer ')[1];
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { code_challenge, state, device_name } = req.body;
        
        if (!code_challenge) return res.status(400).send('Missing code_challenge');

        const authCode = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
        
        await admin.firestore().collection('flowbrowser_auth').doc(authCode).set({
            userId: decodedToken.uid,
            code_challenge,
            state,
            device_name,
            expiresAt
        });
        
        res.status(200).json({ authCode });
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});

app.post('/api/flowbrowser/exchange', async (req, res) => {
    const { code_verifier, authCode } = req.body;
    
    try {
        const customToken = await admin.firestore().runTransaction(async (transaction) => {
            const docRef = admin.firestore().collection('flowbrowser_auth').doc(authCode);
            const doc = await transaction.get(docRef);
            
            if (!doc.exists) throw new Error('Invalid code');
            const data = doc.data()!;
            if (data.expiresAt < Date.now()) throw new Error('Code expired');
            
            // PKCE S256 verification
            if (sha256(code_verifier) !== data.code_challenge) {
                throw new Error('Invalid code_verifier');
            }
            if (req.body.state && req.body.state !== data.state) {
                throw new Error('Invalid state');
            }
            
            // Create device record
            await admin.firestore().collection('connected_devices').add({
                userId: data.userId,
                deviceName: data.device_name,
                linkedAt: Date.now()
            });
            
            // Delete auth code
            transaction.delete(docRef);
            
            return await admin.auth().createCustomToken(data.userId);
        });
        
        res.status(200).json({ customToken });
    } catch (error: any) {
        if (error.message === 'Invalid code' || error.message === 'Code expired' || error.message === 'Invalid code_verifier') {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

app.get('/api/flowbrowser/devices', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send('Unauthorized');
    const token = authHeader.split('Bearer ')[1];
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const devices = await admin.firestore().collection('connected_devices')
            .where('userId', '==', decodedToken.uid).get();
            
        res.status(200).json({ devices: devices.docs.map(d => ({ id: d.id, ...d.data() })) });
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});

app.delete('/api/flowbrowser/devices/:deviceId', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send('Unauthorized');
    const token = authHeader.split('Bearer ')[1];
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const deviceRef = admin.firestore().collection('connected_devices').doc(req.params.deviceId);
        const device = await deviceRef.get();
        
        if (!device.exists || device.data()?.userId !== decodedToken.uid) return res.status(404).send('Not found');
        
        await deviceRef.delete();
        res.status(200).send('Deleted');
    } catch (error) {
        res.status(500).send('Error');
    }
});

app.post('/api/flowbrowser/revoke', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send('Unauthorized');
    const token = authHeader.split('Bearer ')[1];
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const devices = await admin.firestore().collection('connected_devices')
            .where('userId', '==', decodedToken.uid).get();
            
        const deletions = devices.docs.map(d => d.ref.delete());
        await Promise.all(deletions);
        
        res.status(200).send('Revoked');
    } catch (error) {
        res.status(500).send('Error');
    }
});

// Setup Vite middleware for development
async function startServer() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
  
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

startServer();
