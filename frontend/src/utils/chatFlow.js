/**
 * Check-App Chat Flow State Machine
 * Defines state transitions and actions for the chat conversation
 */

import ChatState from '../constants/chatStates';

/**
 * Define allowed transitions from each state
 */
export const stateTransitions = {
    [ChatState.GREET]: {
        onInitialize: ChatState.CHOICE,
        onGreeting: ChatState.CHOICE,
    },
    [ChatState.CHOICE]: {
        onConsult: ChatState.CONSULTING,
        onLearn: ChatState.CHOICE, // Stay in CHOICE but show info
        onGreeting: ChatState.CHOICE,
    },
    [ChatState.CONSULTING]: {
        onInputSymptoms: ChatState.INPUT_SYMPTOMS,
    },
    [ChatState.INPUT_SYMPTOMS]: {
        onSymptomsEntered: ChatState.CONFIRM_SYMPTOMS,
    },
    [ChatState.CONFIRM_SYMPTOMS]: {
        onConfirm: ChatState.RESULT_OPTIONS, // After API analysis
        onRetry: ChatState.INPUT_SYMPTOMS,
    },
    [ChatState.RESULT_OPTIONS]: {
        onRecommendRequest: ChatState.INPUT_LOCATION,
        onDismiss: ChatState.BYE,
    },
    [ChatState.INPUT_LOCATION]: {
        onLocationEntered: ChatState.INPUT_LOCATION, // Show confirmation
        onLocationConfirm: ChatState.RESULT_OPTIONS, // After API recommendation
        onLocationRetry: ChatState.INPUT_LOCATION,
    },
    [ChatState.BYE]: {
        // Terminal state - no outgoing transitions
    },
};

/**
 * Get the next state based on current state and action
 *
 * @param {string} currentState - Current chat state
 * @param {string} action - Action taken by user or system
 * @returns {string|null} Next state or null if invalid transition
 */
export const getNextState = (currentState, action) => {
    const transitions = stateTransitions[currentState];
    if (!transitions) {
        console.warn(`No transitions defined for state: ${currentState}`);
        return null;
    }

    return transitions[action] || null;
};

/**
 * Check if a state is terminal (chat should not accept more input)
 *
 * @param {string} state - Chat state to check
 * @returns {boolean} True if this is a terminal state
 */
export const isTerminalState = (state) => {
    return state === ChatState.BYE;
};

/**
 * Get quick reply options for a given state
 */
export const getQuickRepliesForState = (state) => {
    switch (state) {
        case ChatState.CHOICE:
            return [
                { label: "Consult my condition", value: "onConsult" },
                { label: "Learn about Check-App", value: "onLearn" }
            ];
        case ChatState.CONFIRM_SYMPTOMS:
            return [
                { label: "Yes, that is correct", value: "onConfirm" },
                { label: "Not quite right", value: "onRetry" }
            ];
        case ChatState.RESULT_OPTIONS:
            return [
                { label: "Recommend to me", value: "onRecommendRequest" },
                { label: "I'll check my own", value: "onDismiss" }
            ];
        default:
            return [];
    }
};

export default stateTransitions;
