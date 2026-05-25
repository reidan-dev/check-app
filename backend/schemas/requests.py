"""Check-App Request/Response Schemas"""

from pydantic import BaseModel, Field


class AnalyzeSymptomsRequest(BaseModel):
    symptoms: str = Field(..., min_length=70)


class RecommendSpecialistsRequest(BaseModel):
    specialist: str
    location: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    specialists_count: int


class AnalyzeSymptomsResponse(BaseModel):
    success: bool
    specialist: str | None = None
    symptoms_analyzed: str | None = None
    error: str | None = None


class DoctorRecord(BaseModel):
    doctor: str
    specialty: str
    location: str
    clinic: str
    contact: str
    online: str


class RecommendSpecialistsResponse(BaseModel):
    success: bool
    specialist_type: str | None = None
    location_searched: str | None = None
    localDoctors: list[DoctorRecord] = []
    onlineDoctors: list[DoctorRecord] = []
    local_count: int = 0
    online_count: int = 0
