import { db } from "./firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { toast } from "sonner";

/**
 * Common Firestore utilities for YouTune
 */

export const toggleCollectionItem = async (email, collectionName, video, currentItems) => {
  if (!email) return;
  const userRef = doc(db, "users", email);
  const videoId = video.id?.videoId || video.id;
  
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return;

    const userData = docSnap.data();
    const existingItems = userData[collectionName] || [];
    const existingItem = existingItems.find(v => (v.id?.videoId || v.id) === videoId);

    if (existingItem) {
      // Remove it
      const updatedItems = existingItems.filter(v => (v.id?.videoId || v.id) !== videoId);
      await updateDoc(userRef, {
        [collectionName]: updatedItems
      });
      return { action: "removed", item: existingItem };
    } else {
      // Add it
      await updateDoc(userRef, {
        [collectionName]: arrayUnion(video)
      });
      return { action: "added", item: video };
    }
  } catch (err) {
    console.error(`Error toggling ${collectionName}:`, err);
    throw err;
  }
};

export const addToHistoryUtil = async (email, video, currentHistory) => {
  if (!email) return;
  const userRef = doc(db, "users", email);
  const videoId = video.id?.videoId || video.id;
  
  try {
    // Fetch the latest document to ensure we have the most current history
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return;

    const userData = docSnap.data();
    const existingHistory = userData.history || [];

    // Filter out any existing entries with this ID
    const updatedHistory = existingHistory.filter(v => (v.id?.videoId || v.id) !== videoId);

    // Add new entry at the end (will be reversed in UI)
    const newEntry = { ...video, watchedAt: new Date().toISOString() };
    updatedHistory.push(newEntry);

    // Update the document with the cleaned history
    await updateDoc(userRef, {
      history: updatedHistory
    });
    
    console.log("History updated successfully (duplicates removed)");
  } catch (err) {
    console.error("Error updating history:", err);
  }
};

export const removeFromCollection = async (email, collectionName, video) => {
  if (!email) return;
  const userRef = doc(db, "users", email);
  try {
    await updateDoc(userRef, {
      [collectionName]: arrayRemove(video)
    });
    toast.success(`Removed from ${collectionName}`);
  } catch (err) {
    console.error(`Error removing from ${collectionName}:`, err);
    toast.error("Failed to remove item");
  }
};

export const saveSubscriptionsToFirebase = async (email, subscriptions) => {
  if (!email) return;
  const userRef = doc(db, "users", email);
  try {
    await updateDoc(userRef, { subscriptions });
    console.log("Subscriptions saved to Firebase");
  } catch (err) {
    console.error("Error saving subscriptions to Firebase:", err);
  }
};

export const addSubscriptionToFirebase = async (email, subscription) => {
  if (!email) return;
  const userRef = doc(db, "users", email);
  try {
    await updateDoc(userRef, {
      subscriptions: arrayUnion(subscription)
    });
  } catch (err) {
    console.error("Error adding subscription to Firebase:", err);
  }
};

export const removeSubscriptionFromFirebase = async (email, channelId) => {
  if (!email) return;
  const userRef = doc(db, "users", email);
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return;

    const userData = docSnap.data();
    const existingSubs = userData.subscriptions || [];
    const updatedSubs = existingSubs.filter(
      (s) => s.snippet.resourceId.channelId !== channelId
    );

    await updateDoc(userRef, {
      subscriptions: updatedSubs
    });
  } catch (err) {
    console.error("Error removing subscription from Firebase:", err);
  }
};
