"""Check-App Specialists Database"""

import pandas as pd
import numpy as np
from backend.utils.logging_config import get_logger
from backend.config.settings import SPECIALISTS_CSV_PATH

logger = get_logger(__name__)


class SpecialistDatabase:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.dataframe = pd.DataFrame()
        self.loaded = False

    def load_database(self):
        for encoding in ['utf-8', 'latin1', 'cp1252']:
            try:
                self.dataframe = pd.read_csv(SPECIALISTS_CSV_PATH, encoding=encoding)
                self.loaded = True
                logger.info(f"Specialists database loaded with {encoding}: {len(self.dataframe)} records")
                return True
            except UnicodeDecodeError:
                continue
        logger.warning("Could not load specialists CSV with any encoding")
        return False

    def find_specialists(self, specialist_type, location):
        if not self.loaded or len(self.dataframe) == 0:
            return pd.DataFrame(), pd.DataFrame()

        local_df = self.dataframe[
            (self.dataframe['Specialty'] == specialist_type) &
            (self.dataframe["Clinic"].str.lower().str.contains(location.lower(), na=False))
             ]

        online_df = self.dataframe.replace(np.nan, '', regex=True)
        online_df = online_df[
            (online_df['Specialty'] == specialist_type) &
            (online_df['Online'] != "")
         ]

        return local_df, online_df

    def dataframe_to_records(self, df):
        if not isinstance(df, pd.DataFrame) or len(df) == 0:
            return []

        records = []
        for _, row in df.iterrows():
            record = {
                "doctor": str(row.get("Doctor", "")),
                "specialty": str(row.get("Specialty", "")),
                "location": str(row.get("Location", "")),
                "clinic": str(row.get("Clinic", "")),
                "contact": str(row.get("Contact", "")) if pd.notna(row.get("Contact")) else "",
                "online": str(row.get("Online", "")) if pd.notna(row.get("Online")) else ""
             }
            records.append(record)
        return records

    def get_record_count(self):
        return len(self.dataframe) if self.loaded else 0

    def is_loaded(self):
        return self.loaded
