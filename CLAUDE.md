# Farm Manager Application

## Project Overview
Farm Manager is a React-based web application designed to help manage farm operations including livestock tracking, employee management, food stock inventory, task scheduling, and reporting. The application is built for a thesis project (Licenta) and is deployed on GitHub Pages.

## Tech Stack
- **Frontend Framework**: React 18.3.1
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router DOM v7
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Data Visualization**: Recharts
- **Maps Integration**: Google Maps API (@react-google-maps/api)
- **Internationalization**: i18next
- **Date Handling**: Day.js
- **Drag & Drop**: react-beautiful-dnd
- **Calendar**: react-calendar
- **Build Tool**: Create React App (react-scripts)

## Project Structure
```
farm-manager/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable React components
│   │   ├── NeededStock.js           # Automatic feed requirement calculator
│   │   ├── FoodStockTables.js       # Current stock tables
│   │   ├── LocationConditions.js    # Parcel conditions display
│   │   ├── CropRecommendations.js   # Crop suitability recommendations
│   │   ├── EditLocationConditionsModal.js  # Location data editor
│   │   └── ... (other components)
│   ├── contexts/         # React Context providers (Loading, IsAdmin)
│   ├── firebase/         # Firebase configuration
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   ├── Dashboard.js      # Main dashboard
│   │   ├── Animals.js        # Livestock management
│   │   ├── Stocks.js         # Tabbed feed stock management (Current/Needed/Production)
│   │   ├── ParcelDetails.js  # Parcel conditions and crop recommendations
│   │   ├── Reports.js        # Analytics and reports
│   │   └── Login.js          # Authentication
│   ├── services/         # Business logic and API calls
│   │   ├── farmService.js    # Main service for farm operations
│   │   │   # Includes: animals, food stock, consumption rates, location conditions
│   │   ├── taskService.js    # Task management service
│   │   ├── utils.js          # Utility functions
│   │   └── constants.js      # Application constants
│   ├── App.js            # Main application component with routing
│   ├── index.css         # Global styles
│   └── i18n.js           # i18n configuration (EN/RO translations)
├── package.json
├── README.md
└── CLAUDE.md            # This file - project documentation
```

## Key Features
1. **Dashboard**: Overview of farm operations with key metrics and weather integration
2. **Animals Management**: Track and manage livestock (cows, horses) with detailed information
   - Extensible system supporting multiple species
   - Automatic detection of new species added to the database
3. **Food Stock Management**: Comprehensive feed inventory system with tabbed interface
   - **Current Stock Tab**: Monitor and manage current feed inventory
   - **Needed Stock Tab**: Automatic calculation of annual feed requirements
     - Dynamic species support (automatically includes all species from Animals page)
     - Farmer-defined daily consumption rates (kg/day per animal)
     - Automatic annual calculations (displayed in tonnes)
     - Real-time updates when animals are added/removed
     - Per-species consumption rate management
   - **Production Plan Tab**: Placeholder for future production planning features
4. **Employee Management**: Track employee information and roles (admin/regular)
5. **Task Scheduling**: Create, assign, and track farm tasks
6. **Notes System**: Add notes and reminders
7. **Reports**: Generate and view various farm reports
8. **Parcel Details**: Manage parcel location conditions and view crop recommendations
   - Location condition tracking (climate, soil, altitude, agriculture)
   - Crop recommendation system based on location conditions
9. **Multi-language Support**: Romanian (ro-RO) and English via i18next
10. **Authentication**: Login system with role-based access control

## Firebase Collections Structure
```
firestore/
├── notes                 # Farm notes and reminders
├── tasks                 # Task assignments
├── users                 # Employee/user information
├── livestock/
│   └── animalsInfo/
│       ├── cow           # Cow records
│       ├── horse         # Horse records
│       └── [species]     # Extensible - add new species here
├── authentication        # Auth data
├── foodstock            # Food inventory records (current stock)
├── consumptionRates      # Daily consumption rates per species
│   ├── cow              # Consumption rates for cows (kg/day per animal)
│   ├── horse            # Consumption rates for horses (kg/day per animal)
│   └── [species]        # Rates for additional species
└── locationConditions    # Parcel location condition data
```

## Authentication & Authorization
- Uses localStorage for authentication state (`isAuthenticated`)
- Role-based access via `IsAdminContext`
- Employee information determines admin privileges
- PrivateRoute component protects authenticated routes
- Login page at `/login` route

## Pages

### Dashboard (`/`)
- Overview of farm operations
- Weather integration with forecasts
- Key metrics display
- Farm information
- Quick access to tasks and notes

### Animals (`/animals`)
- Livestock tracking and management
- Add/edit/delete animals
- View animal details (ID, species, birth date, gender, treatment, observations)
- Supports multiple species (cow, horse, and extensible for more)
- Data stored per species in Firebase

### Stocks (`/stocks`)
Tabbed interface for comprehensive feed management:

#### Tab 1: Current Stock
- Monitor current feed inventory
- Add/edit food stock items
- Categorized by food type (concentrates, fiber, green fodder, succulents)
- Track quantities and last modified dates

#### Tab 2: Needed Stock ⭐
- **Automatic calculation** of annual feed requirements
- **Dynamic species support** - automatically detects all species from Animals page
- **Farmer-defined consumption rates**:
  - No default values (farmers set their own)
  - Input: kg/day per animal
  - Auto-calculates: annual needs in tonnes
- **Real-time updates** when animals are added/removed
- **Summary cards**: Animal counts per species + total annual needs
- **Detailed tables**: Per-species consumption rates and totals
- **Editable rates**: Click edit icon to modify consumption values
- **Reset functionality**: Clear rates to zero

#### Tab 3: Production Plan (Placeholder)
- Future feature for production planning

### Parcel Details (`/parcel-details`)
- **Location Conditions Management**:
  - Climate data (temperature, precipitation, frost days)
  - Soil characteristics (pH, type, water retention, nitrogen)
  - Altitude and agriculture data
  - Auto-fetch from location services or manual entry
- **Crop Recommendations**:
  - AI-powered suitability analysis
  - Based on location conditions
  - Crop rotation considerations
  - Top 10 recommended crops with scores

### Reports (`/reports`)
- Analytics and data visualization
- Gender distribution charts (cows, horses)
- Age group analysis
- Visual reports using Recharts

### Login (`/login`)
- Authentication page
- Username/password login
- Role-based access control

## Routes
- `/` - Dashboard (protected)
- `/login` - Login page (public)
- `/animals` - Animals management (protected)
- `/stocks` - Food stock management with tabs (protected)
- `/parcel-details` - Parcel conditions and crop recommendations (protected)
- `/reports` - Reports view (protected)
- `*` - Redirects to login

## Key Components
### Layout Components
- **Navbar**: Top navigation bar with menu toggle
- **Sidebar**: Side navigation menu
- **Footer**: Application footer

### Feature Components
- **AnimalsTable**: Display and manage livestock data
- **FoodStockTables**: Display and manage food inventory (used in Current Stock tab)
- **NeededStock**: Automatic feed requirement calculation system
  - Dynamic species detection and support
  - Farmer-defined consumption rate management
  - Annual requirement calculations in tonnes
  - Real-time updates based on animal counts
- **LocationConditions**: Display and manage parcel location conditions
  - Climate, soil, altitude, and agriculture data
  - Auto-fetch from location services or manual input
- **CropRecommendations**: AI-powered crop suitability recommendations
  - Based on location conditions and crop rotation
- **Employees**: Employee list and management
- **Notes**: Notes list and management
- **TaskCard**: Individual task display component
- **FarmInfo**: Farm information display

### Modal Components
- Add/Edit/Delete modals for:
  - Animals
  - Employees
  - Food Stock
  - Notes
  - Tasks
- **ShowAnimalModal**: View detailed animal information
- **EmployeesInfoModal**: View employee details
- **EditLocationConditionsModal**: Edit parcel location conditions
  - Climate data (temperature, precipitation, frost days)
  - Soil data (pH, type, water retention, nitrogen)
  - Altitude and agriculture data
  - Auto/manual mode toggle

## Services
### farmService.js
Main service file containing:
- Weather icon helpers (`getWeatherIcon`)
- Date formatting utilities (`formatDate`, `getDayName`)
- Firestore collection references
- CRUD operations for all entities
- Employee management functions
- Animal management functions
  - `fetchCows()` - Fetch all cows
  - `fetchHorses()` - Fetch all horses
  - `fetchAllAnimalsBySpecies()` - Fetch all animals grouped by species (extensible for new species)
  - `addAnimal()` - Add new animal
- Food stock management functions
  - `fetchFoodStock()` - Fetch current food stock
  - `updateFoodStock()` - Update food stock items
- **Consumption Rate Management** (New):
  - `getEmptyConsumptionRates()` - Returns empty consumption rate structure (all zeros)
  - `fetchConsumptionRates(speciesList)` - Fetch consumption rates for given species
  - `updateConsumptionRate(species, foodType, value)` - Update specific consumption rate
  - `resetConsumptionRates(species)` - Reset species consumption rates to zero
  - `calculateNeededStock()` - Calculate annual feed requirements for all animals
    - Returns: needed stock by food type, animal counts per species, consumption rates
    - Automatically calculates: (kg/day per animal) × 365 × number of animals
- **Location Conditions Management**:
  - `fetchLocationConditions()` - Fetch parcel location conditions
  - `saveLocationConditions()` - Save location condition data
  - `getCropRecommendations()` - Generate crop recommendations based on conditions

### taskService.js
Task-specific operations for scheduling and management

### utils.js
Utility functions used across the application

## Development Commands
```bash
npm start          # Run development server (localhost:3000)
npm test           # Run tests
npm run build      # Build for production
npm run predeploy  # Pre-deployment build
npm run deploy     # Deploy to GitHub Pages
```

## Deployment
- **Hosting**: GitHub Pages
- **Homepage**: https://bondastefana.github.io/farm-management-app/
- **Router**: Uses HashRouter for GitHub Pages compatibility
- **Deployment Command**: `npm run deploy` (uses gh-pages package)

## Environment Variables
Required `.env` file variables:
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

## Important Notes
1. **Build Configuration**: Uses `--no-eslint` flag in build script
2. **Localization**: Default locale is Romanian (ro-RO)
3. **Loading State**: Global loading state managed via LoadingContext
4. **Material-UI**: Uses MUI X Data Grid for tables
5. **Date Pickers**: MUI X Date Pickers with Day.js adapter
6. **Maps**: Integrated Google Maps for location features
7. **Responsive Design**: Mobile-friendly layout with drawer navigation
8. **Tabbed Interface**: Stocks page uses Material-UI Tabs for organizing functionality
9. **Extensible Species System**: Animal management is designed to easily support new species
   - Add collection reference in `farmService.js`
   - Add to `fetchAllAnimalsBySpecies()` array
   - System automatically detects and includes in calculations
10. **Consumption Rates**: No default values - farmers must set their own based on their specific animals
11. **Unit Display**:
    - Daily consumption rates: kg/day
    - Annual totals and needed stock: tonnes
    - Current stock inventory: kg

## Needed Stock System (Detailed)

### Overview
The Needed Stock system automatically calculates annual feed requirements based on:
- Current animal counts (from Animals page)
- Farmer-defined daily consumption rates
- Dynamic species detection (works with any species added to the system)

### How It Works

#### 1. Data Input
- **No Default Values**: Farmers must set their own consumption rates
- **Input Format**: kg/day per animal (more intuitive for farmers)
- **Food Types**: Concentrates, Fiber, Green Fodder, Succulents
- **Editable**: Consumption rates can be modified anytime via edit icons

#### 2. Automatic Calculations
```
Daily Rate per Animal (farmer sets): X kg/day
Annual Rate per Animal: X kg/day × 365 days = Y kg/year
Total Annual Need: Y kg/year × Number of Animals = Z kg
Display: Z / 1000 = tonnes
```

#### 3. Dynamic Species Support
The system automatically detects and supports any species in the database:
- Fetches all species from `livestock/animalsInfo/` collection
- Creates consumption rate entries for each species found
- Displays species-specific cards with appropriate emojis (🐄 cow, 🐴 horse, etc.)
- Calculates totals across all species

#### 4. Adding New Species
To add support for a new species (e.g., sheep):
1. Create collection: `livestock/animalsInfo/sheep`
2. Add collection reference in `farmService.js`:
   ```javascript
   const sheepCollectionRef = collection(db, 'livestock', 'animalsInfo', 'sheep');
   ```
3. Add to `fetchAllAnimalsBySpecies()` function:
   ```javascript
   { name: 'sheep', ref: sheepCollectionRef }
   ```
4. Add translations in `i18n.js`: `sheep: "Sheep"`, `oaie: "Oaie"`
5. (Optional) Add emoji in `NeededStock.js`: `sheep: '🐑'`

The Needed Stock page will automatically:
- Display the new species card
- Allow consumption rate settings
- Include species in all calculations

#### 5. Data Storage
Consumption rates are stored in Firebase:
```
consumptionRates/
  ├── cow/
  │   ├── concentrates: 4.5 (kg/day)
  │   ├── fiber: 8.0 (kg/day)
  │   ├── greenFodder: 15.0 (kg/day)
  │   └── succulents: 3.0 (kg/day)
  └── horse/
      ├── concentrates: 2.0 (kg/day)
      ├── fiber: 7.0 (kg/day)
      ├── greenFodder: 10.0 (kg/day)
      └── succulents: 1.0 (kg/day)
```

#### 6. Real-time Updates
- Automatically recalculates when animals are added/removed
- Updates on tab navigation or manual refresh
- Displays warnings when consumption rates aren't set

### UI Components

#### Summary Cards
- One card per species showing animal count
- Total annual needed card (in tonnes)
- Color-coded and emoji-identified

#### Needed Stock by Food Type Table
- Shows annual needs for each food type (in tonnes)
- Displays percentage of total
- Total row with overall annual requirement

#### Consumption Rates Tables
- One table per species
- Columns:
  - Per Animal/Day (kg) - editable
  - Per Animal/Year (kg) - auto-calculated
  - Annual Total (tonnes) - auto-calculated for all animals
- Edit button for each rate
- Reset button to clear all rates to zero

#### Edit Dialog
- Input: Daily consumption (kg/day per animal)
- Real-time display of:
  - Annual per animal (kg)
  - Total for all animals of that species (tonnes)

## Code Conventions
- Functional components with React Hooks
- Context API for global state management
- Firebase Firestore for all data persistence
- Material-UI components for consistent UI
- i18next for translations
- Day.js for date manipulation

## Recent Changes

### New Features (Uncommitted)
- **Stocks Page Redesign**: Added tabbed interface with three tabs
  - Current Stock: Existing inventory management
  - Needed Stock: New automatic feed requirement calculator
  - Production Plan: Placeholder for future features
- **Needed Stock System**: Comprehensive annual feed requirement calculator
  - Dynamic species support (automatically detects all species)
  - Farmer-defined daily consumption rates (no defaults)
  - Automatic annual calculations (kg/day × 365 × animal count)
  - Display in tonnes for annual totals
  - Real-time updates based on animal counts
  - Per-species consumption rate management
  - Editable rates with reset functionality
- **Extensible Species Architecture**:
  - Easy addition of new animal species
  - Automatic detection and inclusion in calculations
  - Species-specific emojis (🐄 cow, 🐴 horse)
- **Firebase Integration**: New `consumptionRates` collection for storing consumption data
- **Translation Updates**: Added comprehensive EN/RO translations for new features

### Previous Changes (Based on Git History)
- 2a6548e design refactoring
- c7cf2f6 fixes
- ea7fdd4 Adding fixes
- 8d37979 Adding fixes
- c4ffa61 Adding logic

## Testing
- Testing library: @testing-library/react
- Test runner: Jest (via react-scripts)
- DOM testing utilities included
- User event simulation available

## Browser Support
### Production
- >0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Latest Chrome
- Latest Firefox
- Latest Safari
