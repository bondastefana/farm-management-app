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
│   ├── contexts/         # React Context providers (Loading, IsAdmin)
│   ├── firebase/         # Firebase configuration
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components (Dashboard, Animals, Stocks, Reports, Login)
│   ├── services/         # Business logic and API calls
│   │   ├── farmService.js    # Main service for farm operations
│   │   ├── taskService.js    # Task management service
│   │   ├── utils.js          # Utility functions
│   │   └── constants.js      # Application constants
│   ├── App.js            # Main application component with routing
│   ├── index.css         # Global styles
│   └── i18n.js           # i18n configuration
├── package.json
└── README.md
```

## Key Features
1. **Dashboard**: Overview of farm operations with key metrics and weather integration
2. **Animals Management**: Track and manage livestock (cows, horses) with detailed information
3. **Food Stock Management**: Monitor and manage feed inventory
4. **Employee Management**: Track employee information and roles (admin/regular)
5. **Task Scheduling**: Create, assign, and track farm tasks
6. **Notes System**: Add notes and reminders
7. **Reports**: Generate and view various farm reports
8. **Multi-language Support**: Romanian (ro-RO) and English via i18next
9. **Authentication**: Login system with role-based access control

## Firebase Collections Structure
```
firestore/
├── notes                 # Farm notes and reminders
├── tasks                 # Task assignments
├── users                 # Employee/user information
├── livestock/
│   └── animalsInfo/
│       ├── cow           # Cow records
│       └── horse         # Horse records
├── authentication        # Auth data
└── foodstock            # Food inventory records
```

## Authentication & Authorization
- Uses localStorage for authentication state (`isAuthenticated`)
- Role-based access via `IsAdminContext`
- Employee information determines admin privileges
- PrivateRoute component protects authenticated routes
- Login page at `/login` route

## Routes
- `/` - Dashboard (protected)
- `/login` - Login page (public)
- `/animals` - Animals management (protected)
- `/stocks` - Food stock management (protected)
- `/reports` - Reports view (protected)
- `*` - Redirects to login

## Key Components
### Layout Components
- **Navbar**: Top navigation bar with menu toggle
- **Sidebar**: Side navigation menu
- **Footer**: Application footer

### Feature Components
- **AnimalsTable**: Display and manage livestock data
- **FoodStockTables**: Display and manage food inventory
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

## Services
### farmService.js
Main service file containing:
- Weather icon helpers (`getWeatherIcon`)
- Date formatting utilities (`formatDate`, `getDayName`)
- Firestore collection references
- CRUD operations for all entities
- Employee management functions
- Animal management functions
- Food stock management functions

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

## Code Conventions
- Functional components with React Hooks
- Context API for global state management
- Firebase Firestore for all data persistence
- Material-UI components for consistent UI
- i18next for translations
- Day.js for date manipulation

## Recent Changes (Based on Git History)
- c7cf2f6 fixes
- ea7fdd4 Adding fixes
- 8d37979 Adding fixes
- c4ffa61 Adding logic
- ebd2238 Adding logic

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
