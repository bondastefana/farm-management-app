// Firebase v9 Modular SDK - Soil Analysis Creation Example
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import db from "../firebase/firebaseConfig";

/**
 * Create a new soil analysis record
 *
 * @param {string} parcelId - ID of the parcel
 * @param {Date} date - Analysis date
 * @param {string} notes - Optional notes
 * @returns {Promise<string>} - Returns the generated analysisId
 */
export const createSoilAnalysis = async (parcelId, date, notes = "") => {
  try {
    // Create the soil analysis document
    const docRef = await addDoc(collection(db, "soilAnalyses"), {
      parcelId: parcelId,
      date: date,
      notes: notes,
      createdAt: serverTimestamp() // Firebase server timestamp
    });

    // Return the auto-generated document ID
    return docRef.id;
  } catch (error) {
    console.error("Error creating soil analysis:", error);
    throw error;
  }
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example 1: Minimal usage
const example1 = async () => {
  const analysisId = await createSoilAnalysis(
    "parcel123",              // parcelId
    new Date(),               // date
    "Spring 2026 analysis"    // notes
  );
  console.log("Created analysis with ID:", analysisId);
};

// Example 2: With error handling
const example2 = async () => {
  try {
    const analysisId = await createSoilAnalysis(
      "parcel456",
      new Date("2026-03-15"),
      "Pre-planting soil test"
    );
    console.log("Analysis created:", analysisId);
    return analysisId;
  } catch (error) {
    console.error("Failed to create analysis:", error.message);
    return null;
  }
};

// Example 3: Enhanced version with additional fields (recommended)
export const createSoilAnalysisEnhanced = async (parcelId, date, notes = "", additionalData = {}) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');

    const docRef = await addDoc(collection(db, "soilAnalyses"), {
      parcelId: parcelId,
      date: date,
      notes: notes,
      createdAt: serverTimestamp(),
      // Optional additional fields
      status: additionalData.status || "pending",
      parcelName: additionalData.parcelName || "",
      laboratoryName: additionalData.laboratoryName || "",
      createdBy: currentUser.username || "unknown"
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating enhanced soil analysis:", error);
    throw error;
  }
};

// Example 4: Using the enhanced version
const example4 = async () => {
  const analysisId = await createSoilAnalysisEnhanced(
    "parcel789",
    new Date(),
    "Comprehensive soil analysis",
    {
      status: "pending",
      parcelName: "North Field - Florești",
      laboratoryName: "AgriLab Cluj"
    }
  );
  console.log("Enhanced analysis created:", analysisId);
  return analysisId;
};

// ============================================================================
// INTEGRATION WITH EXISTING farmService.js
// ============================================================================

// This simplified version can replace the existing addSoilAnalysis function:
/*
export const addSoilAnalysis = async (parcelId, date, notes = "") => {
  try {
    const docRef = await addDoc(collection(db, "soilAnalyses"), {
      parcelId,
      date,
      notes,
      createdAt: serverTimestamp()
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding soil analysis:", error);
    return { success: false, error: error.message };
  }
};
*/
