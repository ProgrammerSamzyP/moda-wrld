import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAEisomB-MUvDacEUM20unmN00cQDYV_AU",
  authDomain: "moda-wrld.firebaseapp.com",
  databaseURL: "https://moda-wrld-default-rtdb.firebaseio.com",
  projectId: "moda-wrld",
  storageBucket: "moda-wrld.firebasestorage.app",
  messagingSenderId: "226814841837",
  appId: "1:226814841837:web:e08a998fd705dcf2f24de4",
  measurementId: "G-W3Q39VDF29"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ---------- Auth ----------
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const registerUser = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await addDoc(collection(db, 'users'), {
    uid: userCredential.user.uid,
    ...userData,
    createdAt: serverTimestamp()
  });
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

// ---------- Orders ----------
export const saveOrder = async (orderData) => {
  try {
    // Ensure userId is always present (essential for the user's later retrieval)
    const fullOrder = {
      ...orderData,
      userId: orderData.userId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'orders'), fullOrder);
    console.log('Order saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

// Now accepts user's UID and filters by it
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Admin – gets all orders
export const getAllOrders = async () => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error getting all orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export { db, auth, onAuthStateChanged };