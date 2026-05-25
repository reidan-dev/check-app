# Check-App

A modern web-based medical chatbot that helps users find the right doctor for their medical concerns. Using machine learning, Check-App analyzes symptoms described in natural language and recommends appropriate medical specialists based on the user's location.

## Features

- **AI-Powered Symptom Analysis**: Uses a logistic regression model trained on medical symptoms to classify and recommend specialist types
- **Interactive Chat Interface**: Modern, clean React-based chat UI with smooth animations and quick reply buttons
- **Location-Based Recommendations**: Find specialists in your city or province
- **Telemedicine Options**: When no local specialists are found, get online consultation alternatives
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

1. **Greeting**: The chatbot greets you and offers to help with medical concerns
2. **Symptom Description**: Describe your symptoms in the head and neck area (the more detailed, the better)
3. **AI Analysis**: The model analyzes your symptoms and recommends a specialist type (e.g., Neurologist, ENT Specialist)
4. **Location Input**: Provide your city or province
5. **Specialist Recommendations**: Get a list of local specialists with contact details, or telemedicine options

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **Flask** - Python web framework
- **Scikit-learn** - Machine learning (Logistic Regression)
- **Pandas** - Data handling for specialist database
- **NumPy** - Numerical computations

## Project Structure

```
check-app/
├── backend/                  # Flask API server
│   └── __init__.py          # Main backend with ML model loading
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── ChatUI.jsx   # Main chat interface
│   │   ├── App.jsx          # Root component
│   │   └── index.css        # Tailwind styles
│   └── package.json
├── assets/                   # ML model and data files
│   ├── csv/
│   │   └── specialists.csv  # Specialist database
│   └── model/
│       ├── CheckApp_LR_Model.pickle   # Trained model
│       └── vectorizer.pickle          # TF-IDF vectorizer
├── app.py                    # Entry point
└── requirements.txt          # Python dependencies
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd check-app
   ```

2. **Set up the backend**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the application**
   
   In one terminal (backend):
   ```bash
   python app.py
   # Backend runs on http://localhost:5050
   ```

   In another terminal (frontend):
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

5. **Access the chatbot**
   Open http://localhost:5173 in your browser

## API Endpoints

### Health Check
```
GET /health
```
Returns model loading status and specialist count.

### Analyze Symptoms
```
POST /chat/analyze
Content-Type: application/json

{
  "symptoms": "detailed description of symptoms (70+ characters)"
}

Response:
{
  "success": true,
  "specialist": "Neurologist",
  "symptoms_analyzed": "your symptoms text"
}
```

### Recommend Specialists
```
POST /chat/recommend
Content-Type: application/json

{
  "specialist": "Neurologist",
  "location": "Manila"
}

Response:
{
  "success": true,
  "localDoctors": [...],
  "onlineDoctors": [...],
  "local_count": 5,
  "online_count": 10
}
```

## About the Model

The symptom classifier uses a **Logistic Regression** model with **TF-IDF vectorization**:
- Trained on medical symptom descriptions
- Classifies into specialist categories (Neurologist, ENT, etc.)
- Requires 70+ characters for reliable predictions
- Confidence threshold: 50% minimum

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project was created as part of Eskwelabs Cohort 7 Capstone Project.

## Acknowledgments

Created by:
- Bym Buhain
- Eunice Grullo  
- Beverly Lumba
- Dan Pablo

---

**Disclaimer**: This chatbot is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
