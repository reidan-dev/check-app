"""Check-App Backend - REST API for Medical Specialist Recommendation"""

from flask import Flask
from flask_cors import CORS
from backend.utils.logging_config import setup_logging, get_logger
from backend.models.ml_loader import ModelService
from backend.database.specialists import SpecialistDatabase
from backend.routes import health_bp, analyze_bp, recommend_bp

logger = get_logger(__name__)


def create_app(debug=True):
    setup_logging(debug)
    app = Flask(__name__)
    CORS(app)

    logger.info("Initializing Check-App backend...")

    model_service = ModelService()
    if not model_service.load_model():
        logger.error("Failed to load ML model")

    db_service = SpecialistDatabase()
    if not db_service.load_database():
        logger.error("Failed to load specialists database")

    app.register_blueprint(health_bp)
    app.register_blueprint(analyze_bp)
    app.register_blueprint(recommend_bp)

    logger.info("Check-App backend initialized successfully")
    return app


app = create_app(debug=True)
