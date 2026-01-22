# Soil Analysis Data Model

## Overview
This document describes the Firestore data model for managing farm parcels and soil analyses with an **append-only, historical approach**.

## Design Principles

### 1. Append-Only Architecture
- **Never delete** historical records
- **Never update** core data (only status flags)
- All changes create new records
- Enables trend analysis and auditing

### 2. Domain Rules
- A **parcel** is a piece of farm land
- A **soil analysis** contains multiple soil samples
- Each **soil sample** is an individual soil probe at a specific location/depth

### 3. Data Relationships
```
Parcel (1) ──→ (many) Soil Analyses ──→ (many) Soil Samples
```

## Firestore Structure

### Collections Hierarchy

```
parcels/                              ← Root collection
  {parcelId}/                         ← Document
    - name: "North Field"
    - area: 5.2
    - location: { lat: 46.7489, lng: 23.4953 }
    - description: "Main crop field"
    - cropType: "wheat"
    - isActive: true
    - createdAt: Timestamp
    - createdBy: "username"

soilAnalyses/                         ← Root collection
  {analysisId}/                       ← Document
    - parcelId: "abc123"
    - parcelName: "North Field"
    - analysisDate: Timestamp
    - status: "completed"
    - laboratoryName: "AgriLab Cluj"
    - notes: "Spring analysis"
    - createdAt: Timestamp
    - createdBy: "username"

    samples/                          ← Subcollection
      {sampleId}/                     ← Document
        - sampleNumber: 1
        - location: { lat: 46.7489, lng: 23.4953 }
        - depth: 30
        - pH: 6.5
        - nitrogen: 2.3
        - phosphorus: 45
        - potassium: 180
        - organicMatter: 3.2
        - soilType: "Loam"
        - notes: "Near irrigation"
        - createdAt: Timestamp
```

## Data Model Details

### Parcels
**Collection**: `parcels/`

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | string | Auto-generated document ID | ✅ |
| `name` | string | Parcel name/identifier | ✅ |
| `area` | number | Area in hectares | ✅ |
| `location` | object | GPS coordinates `{ lat, lng }` | ✅ |
| `description` | string | Optional description | ❌ |
| `cropType` | string | Current/planned crop | ❌ |
| `isActive` | boolean | Active status (true) or archived (false) | ✅ |
| `createdAt` | Timestamp | Creation timestamp | ✅ |
| `createdBy` | string | Username who created | ✅ |
| `archivedAt` | Timestamp | When archived | ❌ |
| `reactivatedAt` | Timestamp | When reactivated | ❌ |

**Indexes Needed**:
- `isActive` (for filtering active parcels)
- `createdAt` (for sorting)

### Soil Analyses
**Collection**: `soilAnalyses/`

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | string | Auto-generated document ID | ✅ |
| `parcelId` | string | Reference to parcel | ✅ |
| `parcelName` | string | Denormalized for display | ✅ |
| `analysisDate` | Timestamp | Date analysis performed | ✅ |
| `status` | string | `'pending'`, `'completed'`, `'archived'` | ✅ |
| `laboratoryName` | string | Lab name | ❌ |
| `notes` | string | Additional notes | ❌ |
| `createdAt` | Timestamp | Record creation | ✅ |
| `createdBy` | string | Username who created | ✅ |
| `statusUpdatedAt` | Timestamp | Last status change | ❌ |

**Indexes Needed**:
- Composite: `parcelId` + `analysisDate DESC`
- Composite: `parcelId` + `status` + `analysisDate DESC`
- `analysisDate DESC` (for all analyses)

### Soil Samples
**Subcollection**: `soilAnalyses/{analysisId}/samples/`

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | string | Auto-generated document ID | ✅ |
| `sampleNumber` | number | Sample identifier (1, 2, 3...) | ✅ |
| `location` | object | GPS coordinates `{ lat, lng }` | ❌ |
| `depth` | number | Depth in cm | ✅ |
| `pH` | number | pH value (0-14) | ✅ |
| `nitrogen` | number | Nitrogen (g/kg) | ✅ |
| `phosphorus` | number | Phosphorus (mg/kg) | ✅ |
| `potassium` | number | Potassium (mg/kg) | ✅ |
| `organicMatter` | number | Organic matter (%) | ✅ |
| `soilType` | string | Classification (Loam, Clay, etc.) | ❌ |
| `notes` | string | Sample-specific notes | ❌ |
| `createdAt` | Timestamp | Creation timestamp | ✅ |

**Why Subcollection?**
- Samples are tightly bound to analyses
- Easier to fetch all samples for an analysis
- Automatic cleanup if analysis is ever deleted (though we don't delete)
- Better query performance

## API Functions (farmService.js)

### Parcels
```javascript
// Fetch all parcels
const parcels = await fetchParcels();

// Fetch single parcel
const parcel = await fetchParcelById(parcelId);

// Add new parcel
const result = await addParcel({
  name: "South Field",
  area: 3.5,
  location: { lat: 46.7489, lng: 23.4953 },
  description: "Organic vegetables",
  cropType: "tomato"
});

// Archive parcel (mark as inactive)
await archiveParcel(parcelId);

// Reactivate parcel
await reactivateParcel(parcelId);
```

### Soil Analyses
```javascript
// Fetch all analyses for a parcel
const analyses = await fetchSoilAnalysesByParcel(parcelId);

// Fetch all analyses (all parcels)
const allAnalyses = await fetchAllSoilAnalyses();

// Fetch latest completed analysis for a parcel
const latest = await fetchLatestSoilAnalysis(parcelId);

// Add new soil analysis
const result = await addSoilAnalysis({
  parcelId: "abc123",
  parcelName: "North Field",
  analysisDate: new Date(),
  status: "pending",
  laboratoryName: "AgriLab Cluj",
  notes: "Spring 2026 analysis"
});

// Update status only (append-only: only status changes allowed)
await updateSoilAnalysisStatus(analysisId, "completed");
```

### Soil Samples
```javascript
// Fetch all samples for an analysis
const samples = await fetchSoilSamples(analysisId);

// Add single sample
const result = await addSoilSample(analysisId, {
  sampleNumber: 1,
  location: { lat: 46.7489, lng: 23.4953 },
  depth: 30,
  pH: 6.5,
  nitrogen: 2.3,
  phosphorus: 45,
  potassium: 180,
  organicMatter: 3.2,
  soilType: "Loam",
  notes: "Near irrigation"
});

// Add multiple samples at once
const samplesData = [
  { sampleNumber: 1, depth: 30, pH: 6.5, ... },
  { sampleNumber: 2, depth: 30, pH: 6.8, ... },
  { sampleNumber: 3, depth: 30, pH: 6.3, ... }
];
await addMultipleSoilSamples(analysisId, samplesData);

// Calculate averages from all samples
const averages = await calculateSoilAnalysisAverages(analysisId);
// Returns: { pH: 6.5, nitrogen: 2.3, phosphorus: 45, ... }
```

## Usage Workflow

### 1. Create a Parcel
```javascript
const { success, id: parcelId } = await addParcel({
  name: "North Field",
  area: 5.2,
  location: { lat: 46.7489, lng: 23.4953 },
  cropType: "wheat"
});
```

### 2. Start a Soil Analysis
```javascript
const { success, id: analysisId } = await addSoilAnalysis({
  parcelId: parcelId,
  parcelName: "North Field",
  analysisDate: new Date(),
  status: "pending",
  laboratoryName: "AgriLab Cluj"
});
```

### 3. Add Soil Samples
```javascript
await addSoilSample(analysisId, {
  sampleNumber: 1,
  depth: 30,
  pH: 6.5,
  nitrogen: 2.3,
  phosphorus: 45,
  potassium: 180,
  organicMatter: 3.2,
  soilType: "Loam"
});
// Repeat for sample 2, 3, etc.
```

### 4. Mark as Completed
```javascript
await updateSoilAnalysisStatus(analysisId, "completed");
```

### 5. View Historical Data
```javascript
// Get all past analyses for trend analysis
const history = await fetchSoilAnalysesByParcel(parcelId);
// Sorted by date DESC, showing oldest to newest

// Get latest results
const latest = await fetchLatestSoilAnalysis(parcelId);
```

## Historical Trend Analysis

Since data is append-only, you can:

### 1. Track pH Changes Over Time
```javascript
const analyses = await fetchSoilAnalysesByParcel(parcelId);
const pHHistory = [];

for (const analysis of analyses) {
  const averages = await calculateSoilAnalysisAverages(analysis.id);
  pHHistory.push({
    date: analysis.analysisDate,
    pH: averages.pH
  });
}
// Plot pHHistory on a chart
```

### 2. Compare Nutrient Levels
```javascript
const analyses = await fetchSoilAnalysesByParcel(parcelId);
const [latest, previous] = analyses;

const latestAvg = await calculateSoilAnalysisAverages(latest.id);
const previousAvg = await calculateSoilAnalysisAverages(previous.id);

const nitrogenChange = latestAvg.nitrogen - previousAvg.nitrogen;
// "Nitrogen increased by 0.5 g/kg since last analysis"
```

## Benefits of This Design

### ✅ Append-Only Benefits
- **Complete history** of all soil analyses
- **Audit trail** - who created what and when
- **Trend analysis** - track changes over seasons/years
- **No data loss** - mistakes can be identified, not hidden

### ✅ Performance
- Indexes on frequently queried fields
- Subcollections keep queries fast
- Denormalized `parcelName` reduces joins

### ✅ Scalability
- Root-level collections scale well
- Subcollections isolate sample data
- Easy to query specific parcels

### ✅ Flexibility
- Can add new fields without migration
- Status flags allow "soft updates"
- Multiple analyses per parcel for seasonal tracking

## Future Enhancements

### Possible Additions
1. **Sample Photos**: Add image URLs to samples
2. **Lab Reports**: Store PDF URLs of full lab reports
3. **Recommendations**: Link to AI-generated recommendations based on analysis
4. **Alerts**: Notify when nutrients are below thresholds
5. **Seasonal Trends**: Automatic seasonal comparison reports
6. **Export**: CSV/PDF export of historical data

## UI Integration

### Parcel Details Page Components
1. **Parcel List** - Select/manage parcels
2. **Soil Analysis History** - Timeline of all analyses
3. **Add Analysis** - Form to start new analysis
4. **Sample Entry** - Multi-sample form
5. **Results View** - Charts and averages
6. **Comparison View** - Compare multiple analyses

---

**Created**: 2026-01-22
**Data Model Version**: 1.0
**Farm Manager Application**
