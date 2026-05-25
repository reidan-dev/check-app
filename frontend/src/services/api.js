/**
 * Check-App API Client
 * Centralized API integration with error handling
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

/**
 * Analyze symptoms and get specialist recommendation
 *
 * @param {string} symptoms - Description of symptoms (min 70 chars)
 * @returns {Promise<object>} Analysis result with specialist type
 */
export const analyzeSymptoms = async (symptoms) => {
    try {
        const response = await fetch(`${API_URL}/chat/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms })
         });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Analysis failed");
        }

        return await response.json();

    } catch (error) {
        console.error("API Error in analyzeSymptoms:", error);
         throw error;
     }
};

/**
 * Get specialist recommendations by type and location
 *
 * @param {string} specialist - Specialist type (e.g., "Neurologist")
 * @param {string} location - City or province
 * @returns {Promise<object>} List of local and online specialists
 */
export const recommendSpecialists = async (specialist, location) => {
    try {
        const response = await fetch(`${API_URL}/chat/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ specialist, location })
         });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Recommendation failed");
        }

        return await response.json();

    } catch (error) {
        console.error("API Error in recommendSpecialists:", error);
        throw error;
     }
};

export default {
    analyzeSymptoms,
    recommendSpecialists,
};
