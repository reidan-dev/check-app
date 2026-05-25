"""Symptom Analysis Endpoint"""

from flask import Blueprint, request, jsonify
from backend.config.settings import CONFIDENCE_THRESHOLD, MIN_SYMPTOMS_LENGTH, UNDECIDED_LABEL
from backend.schemas.requests import AnalyzeSymptomsResponse
from backend.utils.logging_config import get_logger

logger = get_logger(__name__)
analyze_bp = Blueprint('analyze', __name__, url_prefix='/chat')


@analyze_bp.route('/analyze', methods=['POST'])
def analyze_symptoms():
    try:
        data = request.get_json()
        if not data or 'symptoms' not in data:
            return jsonify(AnalyzeSymptomsResponse(success=False, error="No symptoms provided").model_dump()), 400

        symptoms = data['symptoms']
        if not symptoms:
            return jsonify(AnalyzeSymptomsResponse(success=False, error="No symptoms provided").model_dump()), 400
        if len(symptoms) < MIN_SYMPTOMS_LENGTH:
            return jsonify(AnalyzeSymptomsResponse(success=False, error=f"Please provide more detailed symptoms (at least {MIN_SYMPTOMS_LENGTH} characters)").model_dump()), 400

        from backend.models.ml_loader import ModelService
        model_service = ModelService()
        specialist, confidence = model_service.predict_specialty(symptoms)

        if specialist is None:
            return jsonify(AnalyzeSymptomsResponse(success=False, error="Error analyzing symptoms").model_dump()), 500

        result_specialist = specialist if confidence > CONFIDENCE_THRESHOLD else UNDECIDED_LABEL
        response = AnalyzeSymptomsResponse(success=True, specialist=result_specialist, symptoms_analyzed=symptoms)
        return jsonify(response.model_dump())

    except Exception as e:
        logger.error(f"Error in symptom analysis: {e}")
        return jsonify(AnalyzeSymptomsResponse(success=False, error="Internal server error").model_dump()), 500
