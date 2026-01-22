// ============================================================================
// CREATE SOIL ANALYSIS - Firebase v9 Example
// ============================================================================
//
// This file demonstrates how to create a soil analysis record and get the
// analysisId back.
//
// Firebase v9 Modular SDK is used throughout.
// ============================================================================

import { createSoilAnalysis } from './src/services/farmService';

// ============================================================================
// BASIC USAGE - Minimal Required Fields
// ============================================================================

/**
 * Example 1: Create a soil analysis with minimal fields
 * Returns: analysisId (string)
 */
const example1_minimal = async () => {
  try {
    const analysisId = await createSoilAnalysis(
      "parcel123",                  // parcelId - ID of the parcel
      new Date(),                   // date - Analysis date
      "Spring 2026 soil analysis"   // notes - Optional notes
    );

    console.log("✅ Soil analysis created!");
    console.log("Analysis ID:", analysisId);

    return analysisId;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return null;
  }
};

// ============================================================================
// USAGE VARIATIONS
// ============================================================================

/**
 * Example 2: Create analysis without notes
 */
const example2_no_notes = async () => {
  const analysisId = await createSoilAnalysis(
    "parcel456",
    new Date()
    // notes is optional - defaults to ""
  );

  return analysisId;
};

/**
 * Example 3: Create analysis with specific date
 */
const example3_specific_date = async () => {
  const analysisId = await createSoilAnalysis(
    "parcel789",
    new Date("2026-03-15"),           // Specific date
    "Pre-planting soil test"
  );

  return analysisId;
};

/**
 * Example 4: Create analysis and use the ID immediately
 */
const example4_use_immediately = async () => {
  // Create the analysis
  const analysisId = await createSoilAnalysis(
    "parcel_north_field",
    new Date(),
    "Comprehensive soil test - 5 samples"
  );

  // Use the analysisId to add samples
  console.log(`Now add samples to analysis: ${analysisId}`);

  // You can now use this analysisId to:
  // - Add soil samples
  // - Update status
  // - Display to user

  return analysisId;
};

// ============================================================================
// INTEGRATION WITH UI COMPONENT
// ============================================================================

/**
 * Example 5: React component usage
 */
const ReactComponentExample = () => {
  const handleCreateAnalysis = async (parcelId, formData) => {
    try {
      // Get analysisId from createSoilAnalysis
      const analysisId = await createSoilAnalysis(
        parcelId,
        formData.date,
        formData.notes
      );

      // Success! Now navigate or show success message
      console.log(`Analysis created: ${analysisId}`);

      // Navigate to the analysis details page
      // navigate(`/soil-analysis/${analysisId}`);

      // Or show success toast
      // toast.success("Soil analysis created successfully!");

      return analysisId;
    } catch (error) {
      // Handle error
      console.error("Failed to create analysis:", error);
      // toast.error("Failed to create analysis");
      throw error;
    }
  };
};

// ============================================================================
// COMPLETE WORKFLOW EXAMPLE
// ============================================================================

/**
 * Example 6: Complete workflow - Create analysis and add samples
 */
const example6_complete_workflow = async () => {
  try {
    // Step 1: Create the analysis
    const analysisId = await createSoilAnalysis(
      "parcel_floresti_north",
      new Date(),
      "Spring 2026 - Pre-wheat planting"
    );

    console.log("✅ Analysis created:", analysisId);

    // Step 2: Add soil samples (using other functions)
    // This is just a demonstration - actual implementation in farmService.js
    /*
    await addSoilSample(analysisId, {
      sampleNumber: 1,
      depth: 30,
      pH: 6.5,
      nitrogen: 2.3,
      phosphorus: 45,
      potassium: 180,
      organicMatter: 3.2,
      soilType: "Clay Loam"
    });

    await addSoilSample(analysisId, {
      sampleNumber: 2,
      depth: 30,
      pH: 6.8,
      nitrogen: 2.1,
      phosphorus: 48,
      potassium: 175,
      organicMatter: 3.5,
      soilType: "Loam"
    });

    console.log("✅ Samples added to analysis:", analysisId);

    // Step 3: Mark as completed
    await updateSoilAnalysisStatus(analysisId, "completed");
    console.log("✅ Analysis marked as completed");
    */

    return analysisId;
  } catch (error) {
    console.error("❌ Workflow failed:", error);
    throw error;
  }
};

// ============================================================================
// ERROR HANDLING PATTERNS
// ============================================================================

/**
 * Example 7: Robust error handling
 */
const example7_error_handling = async (parcelId, date, notes) => {
  try {
    // Validate inputs before calling Firebase
    if (!parcelId) {
      throw new Error("Parcel ID is required");
    }

    if (!date || !(date instanceof Date)) {
      throw new Error("Valid date is required");
    }

    // Create the analysis
    const analysisId = await createSoilAnalysis(parcelId, date, notes);

    // Success
    return {
      success: true,
      analysisId: analysisId,
      message: "Soil analysis created successfully"
    };

  } catch (error) {
    // Handle specific Firebase errors
    if (error.code === 'permission-denied') {
      return {
        success: false,
        error: "You don't have permission to create soil analyses"
      };
    }

    if (error.code === 'unavailable') {
      return {
        success: false,
        error: "Firebase is currently unavailable. Please try again."
      };
    }

    // Generic error
    return {
      success: false,
      error: error.message || "Failed to create soil analysis"
    };
  }
};

// ============================================================================
// TESTING
// ============================================================================

// Uncomment to test:
// example1_minimal();

// ============================================================================
// WHAT GETS STORED IN FIRESTORE
// ============================================================================
/*
After calling:
  const analysisId = await createSoilAnalysis("parcel123", new Date(), "Test");

Firestore document created at: soilAnalyses/{analysisId}
{
  parcelId: "parcel123",
  date: Timestamp(2026-01-22T12:00:00Z),
  notes: "Test",
  createdAt: Timestamp(2026-01-22T12:00:05Z)  // Server timestamp
}

The function returns: "abc123xyz" (the auto-generated analysisId)
*/

// ============================================================================
// EXPORTS FOR USE IN OTHER FILES
// ============================================================================

export {
  example1_minimal,
  example2_no_notes,
  example3_specific_date,
  example4_use_immediately,
  example6_complete_workflow,
  example7_error_handling
};
