<div align="center">

<img src="https://img.shields.io/badge/AI--Powered-Drug%20Interaction%20System-blue?style=for-the-badge&logo=health&logoColor=white" alt="Project Banner"/>

# 💊 AI-Based Personalized Drug Interaction Risk Prediction System

**An enterprise-grade, full-stack AI platform for real-time drug interaction analysis, personalized patient risk profiling, and clinical decision support.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Flask](https://img.shields.io/badge/Flask-ML%20Service-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Java](https://img.shields.io/badge/Java-11+-ED8B00?style=flat-square&logo=java&logoColor=white)](https://java.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

> **Empowering clinicians with AI-driven insights to prevent adverse drug events, reduce medication errors, and deliver safer, personalized patient care.**

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Service Setup](#-service-setup-guides)
- [API Reference](#-rest-api-reference)
- [ML Model Details](#-ml-model--algorithms)
- [Risk Classification](#-risk-classification-system)
- [Test Cases](#-clinical-test-cases)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **AI-Based Personalized Drug Interaction Risk Prediction System** is a production-ready, microservices-driven healthcare platform that leverages advanced machine learning to identify potentially dangerous drug combinations in real time.

Designed for **hospitals, pharmacies, telemedicine platforms, and health-tech companies**, the system enables clinicians to:

- **Instantly analyze** multi-drug combinations against patient-specific profiles
- **Quantify risk** using a trained Random Forest classifier (200 estimators)
- **Discover hidden patterns** in prescription data via FP-Growth association rule mining
- **Audit all predictions** with a full clinical-grade log trail
- **Ingest and manage** large drug datasets via a Java Swing desktop application

This system is built with scalability, security, and clinical accuracy at its core — ready for integration into any EHR (Electronic Health Record) or hospital management system.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Risk Prediction** | Random Forest model predicts Low / Medium / High / Critical risk per patient |
| 🔗 **Pattern Mining** | FP-Growth algorithm uncovers frequent drug co-prescription patterns and association rules |
| 👤 **Patient Profiling** | Personalized risk factoring based on age, gender, comorbidities (cardiac, renal, diabetes, liver) |
| 💊 **Drug Database** | Searchable database of drug-drug and drug-condition interactions |
| 📊 **Clinical Dashboard** | Interactive React UI with real-time risk visualization |
| 🖥️ **Desktop Processor** | Java Swing app for bulk CSV dataset ingestion and local mining |
| 🛡️ **Audit Logging** | Full prediction audit trail with timestamps and clinical context |
| 🔐 **Security** | JWT authentication, bcrypt hashing, CORS, Helmet, rate limiting |
| 🐳 **Cloud Ready** | Docker Compose + Kubernetes manifests for seamless deployment |
| 📈 **REST API** | Versioned RESTful API (`/api/v1/`) for EHR/EMR integration |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌────────────────────┐         ┌────────────────────────────┐   │
│  │   React Web App    │         │  Java Swing Desktop App    │   │
│  │  (Vite + React 18) │         │  (Dataset Ingestion / FP)  │   │
│  └────────┬───────────┘         └───────────────┬────────────┘   │
└───────────┼───────────────────────────────────────┼──────────────┘
            │ REST API calls                         │ Direct DB
┌───────────▼───────────────────────────────────────▼──────────────┐
│                       API GATEWAY LAYER                            │
│           Node.js / Express  —  Port 5000                          │
│   ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌───────────────┐   │
│   │  Auth    │ │ Patients │ │  Drugs/DDI   │ │  Predictions  │   │
│   │ Routes   │ │ Routes   │ │   Routes     │ │   Routes      │   │
│   └──────────┘ └──────────┘ └──────────────┘ └───────┬───────┘   │
└──────────────────────────────────────────────────────┼────────────┘
                                                        │ HTTP
┌──────────────────────────────────────────────────────▼────────────┐
│                        ML SERVICE LAYER                            │
│           Python / Flask  —  Port 5001                             │
│   ┌───────────────────────┐    ┌──────────────────────────────┐   │
│   │  Random Forest Model  │    │  FP-Growth Association Rules │   │
│   │  (Scikit-learn, 200T) │    │  (Mlxtend + Custom Miner)    │   │
│   └───────────────────────┘    └──────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼─────────────────────────────┐
│                        DATA LAYER                                   │
│                 MongoDB 6+  — drug_interaction_db                   │
│   Users · Patients · DrugInteractions · DrugConditions              │
│   Predictions · Patterns · AuditLogs                                │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | Component-driven UI |
| Vite | Ultra-fast build tooling |
| Axios | HTTP client for API calls |
| React Router v6 | Client-side routing |
| Bootstrap 5 | Responsive UI framework |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 18+ | Server runtime |
| Express 4 | RESTful API framework |
| Mongoose | MongoDB ODM |
| JWT + bcrypt | Auth & password security |
| Helmet + CORS | HTTP security headers |
| Morgan | HTTP request logging |

### ML Service
| Technology | Purpose |
|------------|---------|
| Python 3.9+ | ML runtime |
| Flask | Lightweight API server |
| Scikit-learn | Random Forest classifier |
| Mlxtend | Apriori / FP-Growth mining |
| Pandas / NumPy | Data processing |
| Joblib | Model serialization |

### Data Processing (Desktop)
| Technology | Purpose |
|------------|---------|
| Java 11+ | Desktop application runtime |
| Java Swing | Native GUI framework |
| Maven | Build & dependency management |
| OpenCSV | CSV file parsing |
| MongoDB Java Driver | Direct DB integration |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker + Compose | Containerization |
| Kubernetes | Orchestration & scaling |
| GitHub Actions | CI/CD pipelines |
| NGINX | Reverse proxy |

---

## 📁 Project Structure

```
patient-medications/
│
├── frontend/                    # ⚛️  React + Vite Web Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route-level page views
│   │   ├── services/            # Axios API service layer
│   │   └── App.jsx              # Root component with routing
│   ├── index.html
│   └── package.json
│
├── backend/                     # 🟢 Node.js / Express REST API
│   ├── controllers/             # Route handler logic
│   ├── models/                  # Mongoose schema definitions
│   ├── routes/                  # Express route declarations
│   ├── middleware/              # Auth, error, rate-limit middleware
│   ├── config/                  # DB, logger, Redis configs
│   ├── services/                # Business logic & ML bridge
│   ├── seed/                    # Sample patients + drug data
│   ├── server.js                # Entry point
│   └── .env                     # Environment configuration
│
├── ml-model/                    # 🤖 Python / Flask ML Service
│   ├── model/                   # Trained model artifacts (.pkl, .json)
│   │   ├── drug_risk_model.pkl  # Random Forest (200 trees)
│   │   ├── association_rules.json  # FP-Growth rules
│   │   ├── scaler.pkl           # Feature scaler
│   │   └── label_encoder.pkl    # Risk label encoder
│   ├── app.py                   # Flask API entry point
│   ├── train_model.py           # Model training pipeline
│   └── requirements.txt
│
├── swing-module/                # ☕ Java Swing Desktop App
│   ├── src/main/java/
│   │   └── com/druganalyzer/    # MVC application classes
│   └── pom.xml                  # Maven build config
│
├── docker-compose.yml           # 🐳 Multi-service orchestration
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

Ensure the following are installed on your system:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| Python | 3.9+ | [python.org](https://python.org/) |
| MongoDB | 6.0+ | [mongodb.com](https://mongodb.com/) or use Atlas |
| Java JDK | 11+ | [adoptium.net](https://adoptium.net/) |
| Maven | 3.8+ | [maven.apache.org](https://maven.apache.org/) |
| Docker | 20+ *(optional)* | [docker.com](https://docker.com/) |

---

## 📋 Service Setup Guides

### 1️⃣ Backend — Node.js + Express + MongoDB

```bash
cd backend
npm install
```

**Configure environment (`.env`):**
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/drug_interaction_db
ML_SERVICE_URL=http://localhost:5001
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**Seed the database** *(30 drugs + 30 interactions + sample patients)*:
```bash
npm run seed
```

**Start the server:**
```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

> ✅ API available at: `http://localhost:5000`

---

### 2️⃣ ML Service — Python + Flask

```bash
cd ml-model
pip install -r requirements.txt
```

**Train the model** *(only needed if retraining)*:
```bash
python train_model.py
```

This generates the following artifacts in `model/`:
- `drug_risk_model.pkl` — Random Forest classifier
- `association_rules.json` — FP-Growth association rules
- `scaler.pkl` — Feature normalizer
- `model_info.json` — Accuracy statistics

**Start the ML API:**
```bash
python app.py
```

> ✅ ML service available at: `http://localhost:5001`

---

### 3️⃣ Frontend — React + Vite

```bash
cd frontend
npm install
npm run dev
```

> ✅ Dashboard available at: `http://localhost:5173`

**Build for production:**
```bash
npm run build
```

---

### 4️⃣ Java Swing Desktop Module

```bash
cd swing-module

# Compile and run directly
mvn compile
mvn exec:java -Dexec.mainClass="com.druganalyzer.DrugAnalyzerApp"
```

**Or build a standalone JAR:**
```bash
mvn package
java -jar target/swing-module-1.0.0-jar-with-dependencies.jar
```

**Desktop App Usage:**
1. Click **📂 Load Dataset** → Select `ml-model/data/drug_interactions.csv`
2. Use the search bar to filter and explore drug records
3. Click **🔗 Run Mining** to generate association rules via FP-Growth
4. Click **💾 Export Rules** to save the discovered rules as a `.txt` file

---

### 🐳 Docker — Run All Services at Once

```bash
# From the project root
docker-compose up --build
```

This starts all services simultaneously:

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 5000 | http://localhost:5000 |
| ML Service | 5001 | http://localhost:5001 |
| MongoDB | 27017 | localhost:27017 |

---

## 📡 REST API Reference

### Base URL: `http://localhost:5000/api`

#### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new clinical user |
| `POST` | `/auth/login` | Authenticate and get JWT token |

#### 💊 Drug Interactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/drugs/search?q={name}` | Search drugs by name |
| `GET` | `/drugs/interactions/{drug1}/{drug2}` | Check specific DDI pair |
| `GET` | `/drugs/conditions/{drug}` | Get drug-condition associations |

#### 🧪 Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/interactions/analyze` | Analyze drug interaction risk |
| `GET` | `/predictions` | List all stored predictions |
| `GET` | `/predictions/{id}` | Get a specific prediction by ID |

#### 👤 Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/patients` | Create a new patient record |
| `GET` | `/patients` | List all patients |
| `GET` | `/patients/{id}` | Get specific patient |
| `PUT` | `/patients/{id}` | Update patient profile |

#### 📊 Patterns
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/interactions/rules` | Get all FP-Growth association rules |
| `GET` | `/patterns` | List mined drug patterns |

#### 🏥 Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Backend health check |

---

### 📋 Example: Analyze Drug Interactions

**Request:**
```bash
curl -X POST http://localhost:5000/api/interactions/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "medications": ["Warfarin", "Aspirin", "Amiodarone"],
    "age": 72,
    "gender": "Male",
    "diseases": ["Heart Failure", "Cardiac Disease"]
  }'
```

**Response:**
```json
{
  "risk_level": "Critical",
  "risk_score": 0.94,
  "confidence": 0.91,
  "interactions_found": [
    {
      "drug_pair": ["Warfarin", "Aspirin"],
      "severity": "High",
      "effect": "Increased bleeding risk"
    },
    {
      "drug_pair": ["Warfarin", "Amiodarone"],
      "severity": "Critical",
      "effect": "Warfarin toxicity, INR elevation"
    }
  ],
  "recommendation": "Immediate clinical review required. Consider dose adjustment or drug substitution.",
  "association_rules": [
    { "antecedent": ["Heart Failure"], "consequent": ["Bleeding Risk"], "confidence": 0.87 }
  ]
}
```

---

## 🤖 ML Model & Algorithms

### Random Forest Classifier
| Parameter | Value |
|-----------|-------|
| Algorithm | Random Forest |
| Estimators | 200 decision trees |
| Features | Age group, gender, medication count, cardiac/renal/diabetes/liver flags |
| Output classes | Low · Medium · High · Critical |
| Evaluation | Accuracy, Precision, Recall, F1-Score, Confusion Matrix |

### FP-Growth Association Rule Mining
| Parameter | Value |
|-----------|-------|
| Algorithm | FP-Growth (Frequent Pattern Growth) |
| Minimum Support | 0.05 |
| Minimum Confidence | 0.6 |
| Output | Drug co-occurrence rules, condition-risk associations |
| Use case | Detecting hidden multi-drug prescription patterns |

### Training Pipeline
```
Raw CSV Data
    │
    ▼
Data Preprocessor (cleaning, normalization, encoding)
    │
    ├──► Random Forest Training ──► drug_risk_model.pkl
    │
    └──► FP-Growth Mining ────────► association_rules.json
```

---

## 🚦 Risk Classification System

| Risk Level | Score Range | Color | Clinical Action |
|------------|-------------|-------|----------------|
| 🟢 **Low** | 0.00 – 0.30 | Green | Standard monitoring; no intervention required |
| 🟡 **Medium** | 0.31 – 0.60 | Amber | Monitor closely; consider dose adjustments |
| 🔴 **High** | 0.61 – 0.80 | Red | Significant risk; clinical review strongly recommended |
| 🟤 **Critical** | 0.81 – 1.00 | Maroon | Immediate attention; consider drug substitution |

---

## 🧪 Clinical Test Cases

The system ships with **20 validated clinical test cases** in `backend/seed/sample_patients.json`:

| Test ID | Scenario | Risk Level | Key Drugs |
|---------|----------|------------|-----------|
| TC-001 | Elderly cardiac patient | 🟤 Critical | Warfarin + Aspirin + Amiodarone + Digoxin |
| TC-003 | SSRI serotonin syndrome | 🟤 Critical | Fluoxetine + Tramadol |
| TC-006 | Statin-antibiotic interaction | 🟤 Critical | Simvastatin + Clarithromycin |
| TC-009 | Renal patient analgesic | 🔴 High | NSAIDs + ACE Inhibitor |
| TC-015 | Diabetic polypharmacy | 🟡 Medium | Metformin + Contrast dye |
| TC-020 | AFib + fungal infection | 🟤 Critical | Warfarin + Fluconazole |

---

## 🗂️ Database Schema Overview

```
drug_interaction_db
├── users              → Clinical staff accounts (JWT auth)
├── patients           → Patient profiles with comorbidities
├── druginteractions   → Drug-Drug interaction dataset
├── drugconditions     → Drug-Condition association dataset
├── predictions        → Prediction results with audit context
├── patterns           → Mined FP-Growth rules
└── auditlogs          → Full prediction audit trail
```

---

## 🚢 Deployment

### Kubernetes (Production)

```bash
# Apply all manifests
kubectl apply -f kubernetes/

# Verify pods
kubectl get pods

# Access via Ingress
kubectl get ingress
```

Included manifests:
- `frontend-deployment.yaml`
- `backend-deployment.yaml`
- `ml-service-deployment.yaml`
- `mongodb-deployment.yaml`
- `ingress.yaml`

### CI/CD Pipeline (GitHub Actions)

| Workflow | Trigger | Actions |
|----------|---------|---------|
| `ci.yml` | Push / PR | Lint, Test, Build |
| `cd.yml` | Merge to `main` | Docker build, Registry push, K8s rollout |

---

## 🔐 Security

- **Authentication**: JWT-based stateless auth with configurable expiry
- **Password Security**: bcrypt hashing (salt rounds: 12)
- **HTTP Security**: Helmet.js for secure HTTP headers
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configurable origin whitelist
- **Input Validation**: Schema-level + middleware validation on all endpoints
- **Audit Logging**: Every prediction logged with user context and timestamp

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute with attribution.

---

## 🤝 Contributing

We welcome contributions from the clinical informatics, AI/ML, and healthcare engineering communities.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add: clinical feature X'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please read `CONTRIBUTING.md` for coding standards and clinical data handling guidelines.

---

## 📞 Contact & Support

For enterprise licensing, EHR integration inquiries, or clinical validation partnerships:

- 📧 Email: `support@drug-interaction-ai.com`
- 🌐 Website: `https://drug-interaction-ai.com`
- 📋 Issues: [GitHub Issues](https://github.com/your-org/drug-interaction-system/issues)

---

<div align="center">

**Built with ❤️ for safer patient care**

*Reducing adverse drug events through the power of AI*

[![Stars](https://img.shields.io/github/stars/your-org/drug-interaction-system?style=social)](https://github.com/your-org/drug-interaction-system)

</div>
