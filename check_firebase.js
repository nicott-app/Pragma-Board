import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

// Configuración de Firebase (usando mcp o variables)
const firebaseConfig = {
  projectId: "ticketingapp-2e4f1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const q = collection(db, 'projects', 'data-ia', 'tickets');
  const snapshot = await getDocs(q);
  console.log("Total tickets:", snapshot.docs.length);
  snapshot.docs.forEach(d => {
    const data = d.data();
    if (data.id === 'DA-028' || data.title.includes('tooltips')) {
      console.log(d.id, data.id, data.status, data.order);
    }
  });
}
check().catch(console.error);
