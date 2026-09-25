// src/services/newsletter.js
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

export async function subscribeToNewsletter(email) {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check if this email is already on the list
  const q = query(
    collection(db, "newsletter_subscribers"),
    where("email", "==", normalizedEmail)
  );
  const existing = await getDocs(q);

  if (!existing.empty) {
    return { status: "already_subscribed" };
  }

  // 2. Add the new subscriber
  const docRef = await addDoc(collection(db, "newsletter_subscribers"), {
    email: normalizedEmail,
    createdAt: serverTimestamp(),
    source: "lockscreen",
    status: "pending",
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : null,
  });

  console.log("Subscriber saved with ID:", docRef.id);
  return { status: "success", id: docRef.id };
}