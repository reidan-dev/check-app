/**
 * Check-App Message Formatter
 * Formats markdown-like syntax into HTML for chat messages
 */

/**
 * Format message text with markdown-like syntax
 * Supports **bold** and *italic* formatting
 *
 * @param {string} text - Message text to format
 * @returns {Array<React.ReactElement>} Array of formatted div elements
 */
export const formatMessage = (text) => {
    return text.split('\n').map((line, index) => {
        let formattedLine = line;

        // Bold text **text**
        formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Italic text *text* (but not inside strong tags)
        formattedLine = formattedLine.replace(/(?<!<strong>)\*(.*?)\*(?!<\/strong>)/g, '<em>$1</em>');

        return <div key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
};

export default formatMessage;
