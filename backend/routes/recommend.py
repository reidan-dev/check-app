"""Specialist Recommendation Endpoint"""

from flask import Blueprint, request, jsonify
from backend.schemas.requests import RecommendSpecialistsResponse
from backend.utils.logging_config import get_logger

logger = get_logger(__name__)
recommend_bp = Blueprint('recommend', __name__, url_prefix='/chat')


@recommend_bp.route('/recommend', methods=['POST'])
def recommend_specialists():
    try:
        data = request.get_json()
        if not data:
            return jsonify(RecommendSpecialistsResponse(success=False).model_dump()), 400

        specialist_type = data.get('specialist', '')
        location = data.get('location', '')

        if not specialist_type or not location:
            return jsonify(RecommendSpecialistsResponse(success=False).model_dump()), 400

        from backend.database.specialists import SpecialistDatabase
        db_service = SpecialistDatabase()
        local_df, online_df = db_service.find_specialists(specialist_type, location)

        local_doctors = db_service.dataframe_to_records(local_df)
        online_doctors = db_service.dataframe_to_records(online_df)

        response = RecommendSpecialistsResponse(
            success=True,
            specialist_type=specialist_type,
            location_searched=location,
            localDoctors=local_doctors,
            onlineDoctors=online_doctors,
            local_count=len(local_doctors),
            online_count=len(online_doctors)
         )
        return jsonify(response.model_dump())

    except Exception as e:
        logger.error(f"Error in specialist recommendation: {e}")
        return jsonify(RecommendSpecialistsResponse(success=False).model_dump()), 500
