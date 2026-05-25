/**
 * Check-App Chat State Machine States
 * Defines all possible chat states for type-safe state management
 */

export const ChatState = {
    GREET: 'greet',                    // Initial greeting sent
    CHOICE: 'choice',                  // Waiting for user to choose option
    CONSULTING: 'consulting',          // User selected "Consult my condition"
    INPUT_SYMPTOMS: 'input_symptoms',  // Waiting for symptom input
    CONFIRM_SYMPTOMS: 'confirm_symptoms', // Showing symptoms, awaiting confirmation
    RESULT_OPTIONS: 'result_options',  // Showing specialist result with options
    INPUT_LOCATION: 'input_location',  // Waiting for location input
    BYE: 'bye',                        // Goodbye sent, chat ending
};

export default ChatState;
