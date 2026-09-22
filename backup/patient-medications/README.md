# 💊 Personalized Drug Interaction Risk Analyzer

An AI-powered full-stack application that helps doctors and pharmacists detect drug-drug interactions and assess personalized patient risk levels.

## 📁 Project Structure

```
patient-medications/
├── frontend/           # React + Vite web dashboard
├── backend/            # Node.js + Express + MongoDB API
├── ml-model/           # Python + Flask + scikit-learn ML service
├── swing-module/       # Java Swing desktop module
└── README.md
```

---

## 🚀 Quick Start (Run All Modules)

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| Python | 3.9+ |
| MongoDB | 6.0+ (local or Atlas) |
| Java JDK | 11+ |
| Maven | 3.8+ |

---

## 1️⃣ Backend (Node.js + Express + MongoDB)

```bash
cd backend
npm install
```

### Configure environment
Edit `.env` if needed:
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/drug_interaction_db
ML_SERVICE_URL=http://localhost:5001
```

### Seed database with 30 drugs + 30 interactions
```bash
npm run seed
```

### Start backend server
```bash
npm start
# or for development with auto-restart:
npm run dev
```
✅ API available at: `http://localhost:5000`

---

## 2️⃣ ML Service (Python + Flask)

```bash
cd ml-model
pip install -r requirements.txt
```

### Train the model
```bash
python train_model.py
```
This generates:
- `model/drug_risk_model.pkl` – Random Forest classifier
- `model/association_rules.json` – Apriori rules
- `model/model_info.json` – accuracy stats

### Start the Flask API
```bash
python app.py
```
✅ ML service available at: `http://localhost:5001`

---

## 3️⃣ Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
✅ Open browser at: `http://localhost:5173`

---

## 4️⃣ Java Swing Desktop Module

```bash
cd swing-module
mvn compile
mvn exec:java -Dexec.mainClass="com.druganalyzer.DrugAnalyzerApp"
```

Or build a standalone JAR:
```bash
mvn package
java -jar target/swing-module-1.0.0-jar-with-dependencies.jar
```

**Usage:**
1. Click **📂 Load Dataset** → Select `ml-model/data/drug_interactions.csv`
2. Use the search bar to filter rows
3. Click **🔗 Run Mining** to generate association rules
4. Click **💾 Export Rules** to save rules as a `.txt` file

---

## 🔌 REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/interactions/analyze` | Analyze drug interactions |
| `GET`  | `/api/drugs/search?q=` | Search drugs by name |
| `POST` | `/api/patients` | Save patient record |
| `GET`  | `/api/patients` | List all patients |
| `GET`  | `/api/interactions/rules` | Get association rules |
| `GET`  | `/health` | Backend health check |

### Example: Analyze Interactions
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

---

## 🤖 ML Model Details

| Component | Details |
|-----------|---------|
| Classifier | Random Forest (200 trees) |
| Association Mining | Apriori via `mlxtend` |
| Features | Age group, gender, #medications, renal/liver/cardiac/diabetes flags |
| Risk Classes | Low · Medium · High · Critical |
| Training Dataset | 60 clinically accurate row |

---

## 🧪 Test Cases

See `backend/seed/sample_patients.json` for 20 comprehensive test cases including:
- **TC-001** Critical: Elderly cardiac patient – Warfarin + Aspirin + Amiodarone + Digoxin
- **TC-003** Critical: SSRI + Tramadol serotonin syndrome risk
- **TC-006** Critical: Statin + Antibiotic interaction (Simvastatin + Clarithromycin)
- **TC-020** Critical: Fungal infection in AFib patient (Warfarin + Fluconazole)

---

## ⚠️ Risk Classification

| Level | Color | Description |
|-------|-------|-------------|
| 🟢 Low | Green | Minimal interaction risk, standard monitoring |
| 🟡 Medium | Amber | Monitor closely, consider alternatives |
| 🔴 High | Red | Significant risk, clinical review required |
| 🟤 Critical | Maroon | Immediate attention, consider drug substitution |

---

## 🗂️ Technology Stack

- **Frontend**: React 18, Vite (Premium Light Theme)
- **Backend**: Node.js, Express 4, Mongoose
- **Database**: MongoDB 6
- **ML**: Python, Flask, Scikit-learn, Mlxtend
- **Desktop**: Java 11, Swing (matching Light Theme aesthetics)
