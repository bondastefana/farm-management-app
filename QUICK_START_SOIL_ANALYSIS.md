# Quick Start - Create Soil Analysis

## Firebase v9 Code - Simple Version

### Function Definition

```javascript
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import db from "../firebase/firebaseConfig";

const soilAnalysesCollectionRef = collection(db, 'soilAnalyses');

/**
 * Create a soil analysis
 * @param {string} parcelId - ID of the parcel
 * @param {Date} date - Analysis date
 * @param {string} notes - Optional notes
 * @returns {Promise<string>} analysisId
 */
export const createSoilAnalysis = async (parcelId, date, notes = "") => {
  try {
    const docRef = await addDoc(soilAnalysesCollectionRef, {
      parcelId: parcelId,
      date: date,
      notes: notes,
      createdAt: serverTimestamp()
    });

    return docRef.id; // Returns the analysisId
  } catch (error) {
    console.error("Error creating soil analysis:", error);
    throw error;
  }
};
```

---

## Usage

### Example 1: Basic Usage
```javascript
import { createSoilAnalysis } from './services/farmService';

const analysisId = await createSoilAnalysis(
  "parcel123",                  // parcelId
  new Date(),                   // date
  "Spring 2026 soil analysis"   // notes
);

console.log("Created analysis:", analysisId);
// Output: "Created analysis: abc123xyz456"
```

### Example 2: In a React Component
```javascript
import { createSoilAnalysis } from '../services/farmService';

const SoilAnalysisForm = () => {
  const handleSubmit = async (formData) => {
    try {
      // Create the analysis
      const analysisId = await createSoilAnalysis(
        formData.parcelId,
        formData.date,
        formData.notes
      );

      // Success!
      console.log("Analysis created:", analysisId);
      alert(`Analysis created with ID: ${analysisId}`);

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create analysis");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Example 3: With Error Handling
```javascript
try {
  const analysisId = await createSoilAnalysis(
    "parcel456",
    new Date("2026-03-15"),
    "Pre-planting test"
  );

  console.log("✅ Success! Analysis ID:", analysisId);
  return analysisId;

} catch (error) {
  console.error("❌ Failed:", error.message);
  return null;
}
```

---

## What Gets Created in Firestore

### Document Location
```
soilAnalyses/
  {analysisId}/    ← Auto-generated ID returned by the function
```

### Document Structure
```json
{
  "parcelId": "parcel123",
  "date": "2026-01-22T10:30:00Z",
  "notes": "Spring 2026 soil analysis",
  "createdAt": "2026-01-22T10:30:05Z"
}
```

---

## Function Location

The `createSoilAnalysis` function is available in:
```
src/services/farmService.js
```

Import it like this:
```javascript
import { createSoilAnalysis } from '../services/farmService';
```

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parcelId` | string | ✅ Yes | ID of the parcel being analyzed |
| `date` | Date | ✅ Yes | Date the analysis was performed |
| `notes` | string | ❌ No | Additional notes (defaults to "") |

---

## Return Value

**Returns**: `string` - The auto-generated `analysisId`

**Example**: `"Hy8KjLmN9pQrStUv1WxY"`

---

## Firebase v9 Features Used

✅ **Modular imports** - `import { addDoc, collection, serverTimestamp }`
✅ **serverTimestamp()** - Uses Firebase server time (not client time)
✅ **Auto-generated IDs** - Firestore creates unique IDs automatically
✅ **Async/await** - Modern JavaScript promises

---

## Complete Workflow Example

```javascript
// Step 1: Create the analysis
const analysisId = await createSoilAnalysis(
  "parcel_floresti",
  new Date(),
  "Spring analysis - 5 samples"
);

// Step 2: Use the analysisId to add samples
await addSoilSample(analysisId, {
  sampleNumber: 1,
  depth: 30,
  pH: 6.5,
  // ... other sample data
});

await addSoilSample(analysisId, {
  sampleNumber: 2,
  depth: 30,
  pH: 6.8,
  // ... other sample data
});

// Step 3: Mark as completed
await updateSoilAnalysisStatus(analysisId, "completed");

console.log("✅ Workflow complete! Analysis ID:", analysisId);
```

---

## Comparison with Full Version

### Simple Version (createSoilAnalysis)
```javascript
const analysisId = await createSoilAnalysis(
  parcelId,
  date,
  notes
);
// Returns: "abc123" (just the ID)
```

### Full Version (addSoilAnalysis)
```javascript
const result = await addSoilAnalysis({
  parcelId: "parcel123",
  date: new Date(),
  notes: "Test",
  status: "pending",
  parcelName: "North Field",
  laboratoryName: "AgriLab Cluj"
});
// Returns: { success: true, id: "abc123" }
```

**Use the simple version** when you just need to create a basic analysis and get the ID.
**Use the full version** when you need additional fields like status, parcelName, laboratoryName, etc.

---

## Next Steps

After creating a soil analysis, you typically:

1. **Add soil samples** using `addSoilSample(analysisId, sampleData)`
2. **Calculate averages** using `calculateSoilAnalysisAverages(analysisId)`
3. **Update status** using `updateSoilAnalysisStatus(analysisId, "completed")`
4. **Display results** in the UI

---

## Testing

Test the function in your browser console:

```javascript
import { createSoilAnalysis } from './services/farmService';

// Test it
createSoilAnalysis("test_parcel", new Date(), "Test notes")
  .then(id => console.log("Created:", id))
  .catch(err => console.error("Error:", err));
```

---

**Created**: 2026-01-22
**Firebase SDK**: v9 (Modular)
**Returns**: analysisId (string)
