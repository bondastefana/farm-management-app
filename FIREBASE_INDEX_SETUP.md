# Firebase Index Setup for Soil Analysis

## Issue
When trying to fetch soil analyses, you may see this error:
```
FirebaseError: The query requires an index. You can create it here: [link]
```

## Why This Happens
Firebase Firestore requires **composite indexes** when you combine `where()` and `orderBy()` clauses in a query.

Our soil analysis queries use:
- `where('parcelId', '==', parcelId)` - Filter by parcel
- `orderBy('date', 'desc')` - Order by date (newest first)

## How to Fix

### Option 1: Click the Link (Easiest)
1. Look at the error message in your browser console
2. Click the provided link in the error message
3. Firebase will open and show you the exact index configuration needed
4. Click "Create Index"
5. Wait 2-5 minutes for the index to be built
6. Refresh your app and try again

### Option 2: Create Manually in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Indexes** tab
4. Click **"Create Index"**
5. Configure the index:

#### Index Configuration for `soilAnalyses` collection:

| Field | Order |
|-------|-------|
| `parcelId` | Ascending |
| `date` | Descending |

**Collection ID**: `soilAnalyses`

**Query Scope**: Collection

6. Click **Create**
7. Wait for the index to build (Status: "Building" → "Enabled")

### Option 3: Using Firebase CLI

If you're using Firebase CLI, add this to your `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "soilAnalyses",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "parcelId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "date",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Then deploy with:
```bash
firebase deploy --only firestore:indexes
```

## Additional Indexes You May Need

If you use the `fetchLatestSoilAnalysis` function, you'll also need:

#### Index for queries with status filter:

| Field | Order |
|-------|-------|
| `parcelId` | Ascending |
| `status` | Ascending |
| `date` | Descending |

**Collection ID**: `soilAnalyses`

## Verification

After creating the index:
1. Wait for status to show "Enabled" in Firebase Console
2. Refresh your application
3. Try creating and viewing soil analyses
4. The error should be gone!

## Notes

- Index building can take 2-10 minutes depending on data size
- You only need to create each index once
- Indexes are shared across all users of your Firebase project
- The error will disappear once the index is built

---

**Created**: 2026-01-22
**For**: Farm Manager Application - Soil Analysis Feature
