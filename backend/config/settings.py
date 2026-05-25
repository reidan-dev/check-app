"""Check-App Configuration Settings"""

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
PROJECT_ROOT = os.path.dirname(ROOT_DIR)

MODEL_PATH = os.path.join(PROJECT_ROOT, "assets", "model", "CheckApp_LR_Model.pickle")
VECTORIZER_PATH = os.path.join(PROJECT_ROOT, "assets", "model", "vectorizer.pickle")
SPECIALISTS_CSV_PATH = os.path.join(PROJECT_ROOT, "assets", "csv", "specialists.csv")

CONFIDENCE_THRESHOLD = 0.50
MIN_SYMPTOMS_LENGTH = 70
UNDECIDED_LABEL = "Undecided"
API_PREFIX = "/chat"
