"""Health Check Endpoint"""

from flask import Blueprint, jsonify
from backend.schemas.requests import HealthResponse

health_bp = Blueprint('health', __name__, url_prefix='/')


@health_bp.route("/health", methods=["GET"])
def health_check():
    from backend.models.ml_loader import ModelService
    from backend.database.specialists import SpecialistDatabase

    model_service = ModelService()
    db_service = SpecialistDatabase()

    response = HealthResponse(
        status="healthy",
        model_loaded=model_service.is_loaded(),
        specialists_count=db_service.get_record_count()
      )
    return jsonify(response.model_dump())
