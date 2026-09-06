# Thermal Insights

Build the complete frontend for my existing project.

PROJECT:

building-energy-hvac-digital-twin

IMPORTANT:

The backend is ALREADY COMPLETE and WORKING.

Do not rebuild the backend.

Do not replace existing thermal, ML, recommendation, NASA POWER, MongoDB, or FastAPI logic.

Your job is to build a production-quality frontend that connects to the existing FastAPI backend.

==================================================

STEP 1 — INSPECT THE PROJECT FIRST

==================================================

Before coding, inspect the existing repository.

Especially inspect:

src/building_hvac_twin/api/main.py

src/building_hvac_twin/api/schemas.py

src/building_hvac_twin/api/routes/prediction.py

src/building_hvac_twin/api/routes/recommendation.py

src/building_hvac_twin/api/routes/simulation.py

Also inspect:

src/building_hvac_twin/recommendation/

src/building_hvac_twin/shelter/

src/building_hvac_twin/database/

Understand the ACTUAL request and response schemas.

DO NOT invent API fields.

==================================================

PROJECT PURPOSE

==================================================

This project is an:

"Intelligent, location-specific passive shelter design decision-support system that combines physics-based thermal simulation, real-world weather data, and machine-learning surrogate models to evaluate thermal comfort and energy performance and recommend improved shelter designs."

The system workflow is:

Shelter Design

        ↓

Geometry / Materials / Openings / Orientation

        ↓

Physics-Based Thermal Simulation

        ↓

NASA POWER Weather

        ↓

Thermal Performance Metrics

        ↓

ML Surrogate Prediction

        ↓

Candidate Ranking

        ↓

Decision Support

The frontend must communicate this workflow clearly.

==================================================

FRONTEND STACK

==================================================

Use:

- React

- Vite

- TypeScript

- React Router

- Tailwind CSS

- Recharts

Use Fetch API or Axios for API requests.

Create:

frontend/

Use a clean maintainable structure.

Suggested structure:

frontend/

├── src/

│   ├── api/

│   │   ├── client.ts

│   │   ├── designs.ts

│   │   ├── scenarios.ts

│   │   ├── predictions.ts

│   │   ├── recommendations.ts

│   │   └── comparisons.ts

│   │

│   ├── components/

│   │   ├── layout/

│   │   ├── common/

│   │   ├── cards/

│   │   ├── charts/

│   │   ├── forms/

│   │   └── tables/

│   │

│   ├── pages/

│   │   ├── Dashboard.tsx

│   │   ├── DesignExplorer.tsx

│   │   ├── Prediction.tsx

│   │   ├── Recommendations.tsx

│   │   ├── Comparison.tsx

│   │   ├── WeatherScenarios.tsx

│   │   └── About.tsx

│   │

│   ├── types/

│   │   └── api.ts

│   │

│   ├── hooks/

│   ├── utils/

│   ├── App.tsx

│   ├── main.tsx

│   └── index.css

│

├── public/

├── package.json

├── vite.config.ts

├── tsconfig.json

├── tailwind.config.js

└── .env.example

You may modify the structure if you have a better clean architecture.

==================================================

API

==================================================

Existing FastAPI endpoints:

GET /health

GET /designs

GET /scenarios

POST /predict

POST /recommend

POST /compare

FastAPI docs:

GET /docs

Frontend API base URL must use:

VITE_API_BASE_URL=http://127.0.0.1:8000

Do NOT hard-code the API URL throughout the frontend.

Create one centralized API client.

==================================================

IMPORTANT ARCHITECTURE RULE

==================================================

The frontend must NOT duplicate backend logic.

DO NOT implement thermal equations in React.

DO NOT calculate:

- heat transfer

- UA

- solar gain

- thermal mass

- comfort

- ML predictions

- recommendation scores

- ranking

- weather calculations

The frontend only:

- collects inputs

- calls FastAPI

- displays results

- creates charts

- handles navigation

- handles loading

- handles errors

FastAPI remains the source of truth.

==================================================

PAGE 1 — DASHBOARD

==================================================

Create a professional engineering dashboard.

Title:

"Passive Shelter Thermal Intelligence"

Subtitle:

"Location-specific thermal performance analysis using physics-based simulation, NASA POWER weather data, and machine-learning prediction."

Show the workflow:

DESIGN → WEATHER → PHYSICS → ML → RECOMMENDATION

Show real system information from the backend.

Use /health, /designs and /scenarios.

Display real:

- number of shelter designs

- number of weather scenarios

- API status

- database status if provided by /health

Do not invent values.

Add quick actions:

- Explore Designs

- Run Prediction

- View Recommendations

- Compare Physics vs ML

==================================================

PAGE 2 — DESIGN EXPLORER

==================================================

Use:

GET /designs

Display real shelter designs.

Provide:

- search

- filtering

- pagination if needed

- table

- design details

Show only fields actually returned by the API.

Allow the user to select a design and continue to:

Prediction

Comparison

The application must handle 300 designs efficiently.

==================================================

PAGE 3 — THERMAL PREDICTION

==================================================

Create:

"Thermal Prediction"

Allow the user to select:

- Design

- Weather Scenario

Populate these from:

GET /designs

GET /scenarios

Then call:

POST /predict

Use the ACTUAL backend request schema.

Display all prediction outputs returned by the backend.

Current project targets include:

- percent_time_comfortable

- degree_hours_below_comfort

- degree_hours_above_comfort

- minimum_indoor_temperature_c

- mean_indoor_temperature_c

- indoor_temperature_range_c

- total_heat_loss_kwh

- total_solar_gain_kwh

- thermal_mass_net_kwh

But DO NOT assume these are exactly the response fields.

Inspect the API first.

Use appropriate charts and metric cards.

Clearly show units:

°C

%

kWh

degree-hours

==================================================

PAGE 4 — RECOMMENDATIONS

==================================================

Create:

"Design Recommendations"

Allow scenario selection.

Call:

POST /recommend

Display ranked candidate designs.

Show:

- rank

- design ID

- recommendation score if returned

- relevant predicted thermal metrics

Highlight the top-ranked candidate.

IMPORTANT:

Use wording:

"Top Ranked Design"

"Recommended Candidate"

"Ranked Candidate Designs"

DO NOT use:

"Guaranteed Optimal Design"

"Perfect Design"

"Globally Optimal Design"

The recommendation engine currently ranks available candidate designs.

Do not hide poor results.

==================================================

PAGE 5 — PHYSICS VS ML

==================================================

Create:

"Physics vs ML Comparison"

Allow selection of:

- Design

- Scenario

Call:

POST /compare

Display:

Physics result

ML prediction

Difference

Use:

- comparison table

- bar charts

- difference indicators

IMPORTANT:

Do not hide discrepancies.

If ML differs significantly from physics simulation, show it clearly.

Do not make ML look artificially accurate.

Use language such as:

"ML surrogate prediction differs from physics simulation."

==================================================

PAGE 6 — WEATHER SCENARIOS

==================================================

Call:

GET /scenarios

Display actual weather scenarios.

Show fields returned by the backend.

Where available, display:

- scenario ID

- location

- season

- date range

- weather source

- relevant weather information

Clearly identify:

"Weather Source: NASA POWER"

Do not describe NASA POWER as local ground-station measurement.

Do not create fake weather charts.

==================================================

PAGE 7 — ABOUT

==================================================

Explain the actual project.

Sections:

1. Problem

2. System Architecture

3. Physics-Based Thermal Model

4. NASA POWER Weather

5. Machine Learning

6. Recommendation System

7. Technology Stack

8. Current Limitations

Show architecture:

Shelter Design

↓

Thermal Parameters

↓

NASA POWER Weather

↓

Physics Simulation

↓

ML Surrogate

↓

Recommendation

↓

Decision Support

Mention actual limitations honestly:

- current dataset contains 3,000 design-weather cases

- ML predictions are surrogate predictions

- comfort prediction is not perfect

- recommendation ranks candidates

- NASA POWER is satellite/reanalysis-derived

- real physical shelter validation is not currently included

==================================================

UI DESIGN

==================================================

Make the UI look like a professional engineering/scientific application.

NOT:

- crypto dashboard

- gaming dashboard

- generic SaaS template

- excessive gradients

- excessive glassmorphism

Use:

- professional dark/light interface

- technical dashboard

- clean cards

- strong typography

- subtle blue/teal accents

- clear charts

- clean spacing

- responsive layout

Use appropriate icons.

Animations should be subtle.

==================================================

LAYOUT

==================================================

Desktop:

Sidebar + Main Content

Sidebar:

Dashboard

Design Explorer

Thermal Prediction

Recommendations

Comparison

Weather Scenarios

About

Header:

Passive Shelter Thermal Intelligence

Show system status.

Mobile:

Use collapsible navigation.

Everything must be responsive.

==================================================

LOADING STATES

==================================================

Every API request needs a proper loading state.

Examples:

"Loading shelter designs..."

"Loading weather scenarios..."

"Running thermal prediction..."

"Generating recommendations..."

"Comparing physics and ML..."

Disable buttons while requests are running.

Use skeletons/spinners where appropriate.

==================================================

ERROR HANDLING

==================================================

Handle:

- backend offline

- 400

- 404

- 422

- 500

- empty results

- malformed response

Show user-friendly messages.

Example:

"Unable to connect to the FastAPI server. Make sure the backend is running on port 8000."

Never show raw stack traces to normal users.

Add retry buttons where useful.

==================================================

NO FAKE DATA

==================================================

THIS IS CRITICAL.

Do NOT create fake:

- shelter designs

- weather scenarios

- predictions

- recommendation scores

- thermal values

- ML accuracy

- statistics

If backend is unavailable:

show an error.

Do NOT silently use mock data.

==================================================

NO FAKE AI CLAIMS

==================================================

Never show:

"99% accurate AI"

"Perfect prediction"

"Guaranteed optimal design"

"AI-generated perfect shelter"

Only display real metrics if they exist in the backend.

==================================================

SECURITY

==================================================

Never expose:

- MongoDB URI

- MongoDB password

- MongoDB username

- database credentials

Frontend .env.example should contain only:

VITE_API_BASE_URL=http://127.0.0.1:8000

Do not copy backend secrets into frontend files.

==================================================

PERFORMANCE

==================================================

Avoid unnecessary API calls.

Load designs/scenarios efficiently.

Do not repeatedly call the same endpoint on every render.

Use reusable hooks where useful.

Do not introduce unnecessary global state libraries.

==================================================

ACCESSIBILITY

==================================================

Use:

- semantic HTML

- labels

- accessible buttons

- keyboard navigation

- proper contrast

- meaningful chart titles

- ARIA labels where needed

==================================================

TESTING

==================================================

After implementation, run the backend:

python -m uvicorn building_hvac_twin.api.main:app --reload

Run frontend:

npm run dev

Test the COMPLETE workflow from browser:

1. Dashboard loads

2. API health works

3. Designs load

4. Scenarios load

5. Prediction works

6. Recommendations work

7. Comparison works

8. Weather page works

9. Navigation works

10. Loading states work

11. Error states work

12. Mobile layout works

Then run:

npm run build

Fix ALL TypeScript/build errors.

Check browser console.

There should be no unnecessary console errors.

==================================================

DO NOT MODIFY BACKEND UNLESS NECESSARY

==================================================

Do not modify:

src/building_hvac_twin/shelter/

src/building_hvac_twin/recommendation/

src/building_hvac_twin/database/

Do not change:

ML dataset

ML training

model files

NASA data pipeline

thermal model

recommendation logic

If CORS prevents frontend access, inspect the existing FastAPI CORS configuration and make only the smallest required compatibility change.

==================================================

IMPORTANT SCIENTIFIC POSITIONING

==================================================

This is an engineering decision-support system.

The project integrates:

Shelter-specific physical design

+

NASA POWER weather

+

Physics-based thermal simulation

+

ML surrogate prediction

+

Candidate recommendation

+

FastAPI

+

MongoDB

+

Interactive frontend

The frontend should communicate this as the project's main strength.

Do not exaggerate novelty or accuracy.

==================================================

FINAL REQUIREMENT

==================================================

DO NOT STOP AT STATIC UI.

The frontend must actually connect to the existing FastAPI backend.

Every major page must use real API data.

At the end provide a report containing:

1. Files created

2. Files modified

3. Dependencies installed

4. Pages implemented

5. API endpoints connected

6. Backend compatibility changes, if any

7. Testing performed

8. npm run build result

9. Known issues

10. How to run the complete project

Before declaring completion, verify:

[ ] React frontend runs

[ ] TypeScript build succeeds

[ ] Tailwind works

[ ] Routing works

[ ] Dashboard works

[ ] /health works

[ ] /designs works

[ ] /scenarios works

[ ] /predict works

[ ] /recommend works

[ ] /compare works

[ ] No fake data

[ ] No fake AI metrics

[ ] No secrets exposed

[ ] Loading states work

[ ] Error states work

[ ] Charts use real API data

[ ] Responsive layout works

[ ] No console errors

[ ] Existing backend remains functional

[ ] npm run build succeeds

START NOW.

First inspect the existing backend schemas and API implementation.

Then build the frontend around the ACTUAL backend.

Do not ask me to manually write code unless absolutely necessary.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/348c4ea8-3d1e-46a8-8af6-42f00252b5f3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
