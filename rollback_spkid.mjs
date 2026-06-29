import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config({ path: '../MC-Connect-SPKProduksi-Form/.env' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const rollbackMap = {
  "E0096MCD002529CU579221AZI01X": "0096Extras-MCD#002529-CU579221AZI",
  "0097RO000462CU570816RIO": "0097RO-000462-CU570816RIO",
  "E0098000462CU570816RIO01X": "0098Extras-000462-CU570816RIO",
  "0099POMCD002537CU577118SUR": "0099PO-MCD#002537-CU577118SUR",
  "0100ROMCD002537CU577118SUR": "0100RO-MCD#002537-CU577118SUR",
  "0101ROMCD002538CU576877SUK": "0101RO-MCD#002538-CU576877SUK",
  "E0102MCD002534CU573021DEN01X": "0102Extras-MCD#002534-CU573021DEN",
  "0103ROMCD002542CU579568HEN": "0103RO-MCD#002542-CU579568HEN",
  "0104POMCD002536CU573021PEM": "0104PO-MCD#002536-CU573021PEM",
  "0105POMCD002547CU570534DEA": "0105PO-MCD#002547-CU570534DEA",
  "A0107PO260622MCD002530CU570000DEN66W": "A0107PO260622MCD#002530CU570000DEN66W",
  "A0109PO260622MCD002540CU570000DEN97K": "A0109PO260622MCD#002540CU570000DEN97K",
  "PA0112260624MCDA2543CU574493AHM66T": "A0112PO-260624-MCD#A2543-CU574493AHM-66T",
  "PA0113260624MCDA2543CU574493AHM60E": "A0113PO-260624-MCD#A2543-CU574493AHM-60E",
  "PA0114260626MCDA2543CU570000DEN79E": "A0114PO-260626-MCD#A2543-CU570000DEN-79E",
  "PA0115260626MCDA2543CU570000DEN18V": "A0115PO-260626-MCD#A2543-CU570000DEN-18V"
};

async function rollback() {
  console.log("Starting SPK ID Rollback...");
  
  let count = 0;
  for (const [newId, oldId] of Object.entries(rollbackMap)) {
    const docRef = doc(db, 'spk_produksi', newId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      data.spk_id = oldId;
      data.id = oldId;
      data.spk_id_masked = newId; // we save the masked ID so the new LKP logic works!
      
      try {
        await setDoc(doc(db, 'spk_produksi', oldId), data);
        await deleteDoc(docRef);
        console.log(`Rolled back: ${newId} -> ${oldId} (with spk_id_masked: ${newId})`);
        count++;
      } catch (err) {
        console.error(`Error rolling back ${newId}:`, err);
      }
    } else {
      console.log(`Warning: Document ${newId} not found. Already rolled back?`);
    }
  }
  console.log(`Rollback complete. Successfully updated ${count} documents.`);
  process.exit(0);
}

rollback();
