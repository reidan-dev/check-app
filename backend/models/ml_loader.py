"""Check-App ML Model Loader"""

import pickle
from backend.utils.logging_config import get_logger
from backend.config.settings import MODEL_PATH, VECTORIZER_PATH

logger = get_logger(__name__)


class ModelService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.model = None
        self.vectorizer = None
        self.loaded = False

    def load_model(self):
        try:
            with open(MODEL_PATH, 'rb') as file:
                self.model = pickle.load(file)
            with open(VECTORIZER_PATH, 'rb') as file:
                self.vectorizer = pickle.load(file)
            self.loaded = True
            logger.info("Model and vectorizer loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False

    def predict_specialty(self, symptoms):
        if not self.loaded or self.model is None or self.vectorizer is None:
            logger.error("Model not loaded - cannot make prediction")
            return None, None

        try:
            proba = self.model.predict_proba(self.vectorizer.transform([symptoms]))[0]
            confidence = max(proba)
            specialist = self.model.predict(self.vectorizer.transform([symptoms]))[0]
            logger.debug(f"Prediction: {specialist} (confidence: {confidence:.2f})")
            return specialist, confidence
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            return None, None

    def is_loaded(self):
        return self.loaded and self.model is not None and self.vectorizer is not None
