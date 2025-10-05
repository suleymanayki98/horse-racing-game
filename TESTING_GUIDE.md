🧪 Testing Guide
🚀 Setup
bash
npm install
🔬 Unit Tests
Running
bash

# Run all tests

npm test

# Watch mode

npm test -- --watch

# Run with UI

npm run test:ui

# Coverage report

npm run test:coverage
Test Files
tests/unit/store.spec.js - Vuex store tests (60+ tests)
tests/unit/components/HorseList.spec.js - Component tests
Test Scenarios
✅ Store Tests:

Horse generation (20 horse creation)
Schedule generation (6 rounds)
Mutations (state updates)
Getters (computed values)
Race flow
✅ Component Tests:

Component render
Props and data binding
User interactions
🎭 E2E Tests
Running
bash

# Terminal 1: Start dev server

npm run dev

# Terminal 2: Open Cypress

npm run test:e2e

# Headless mode

npm run test:e2e:headless
Test Files
cypress/e2e/horse-racing.cy.js - E2E tests (40+ tests)
Test Scenarios
✅ E2E Scenarios:

Initial page load
Program generation
Race execution & animation
Results display
Multiple rounds
UI interactions
Reset functionality
📊 Coverage Report
bash
npm run test:coverage
Coverage report is generated in HTML format in the coverage/ folder.

🎯 Test Commands
Command Description
npm test Run unit tests
npm run test:ui Run with Vitest UI
npm run test:coverage Generate coverage report
npm run test:e2e Open Cypress UI
npm run test:e2e:headless Run Cypress headless
📁 File Structure
tests/
├── unit/
│ ├── store.spec.js # Store tests
│ └── components/
│ └── HorseList.spec.js # Component tests
└── setup.js # Test setup

cypress/
└── e2e/
└── horse-racing.cy.js # E2E tests
🐛 Troubleshooting
Tests failing?

bash

# Clear cache

rm -rf node_modules/.vitest
npm test
Cypress can't connect?

bash

# Check if dev server is running

lsof -i :3000

# Restart

npm run dev
Happy Testing! 🧪
