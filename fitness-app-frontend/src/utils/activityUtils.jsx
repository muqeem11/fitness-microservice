import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import PedalBikeIcon from '@mui/icons-material/PedalBike';

/**
 * Robustly formats an activity date from various possible backend formats.
 * Handles Array [YYYY, MM, DD, HH, mm, ss], string timestamps, and numeric epochs.
 * 
 * @param {Object} activity The activity object containing date info
 * @param {Object} options Formatting options for toLocaleString
 * @returns {string} Formatted date string or fallback
 */
export const formatActivityDate = (activity, options = { dateStyle: 'medium', timeStyle: 'short' }) => {
    let rawValue = activity.createdAt ||
        activity.creationTime ||
        activity.createdDate ||
        activity.timestamp ||
        activity.date ||
        activity.created_at;

    if (!rawValue) return "Recently added";

    // Handle common MongoDB/JSON nested date structures if they appear
    if (typeof rawValue === 'object' && !Array.isArray(rawValue)) {
        if (rawValue.$date) {
            rawValue = rawValue.$date.$numberLong ? parseInt(rawValue.$date.$numberLong) : rawValue.$date;
        } else if (rawValue.epochSecond) {
            // Handle Java Instant serialization: { epochSecond: 12345, nano: 6789 }
            rawValue = rawValue.epochSecond * 1000;
        }
    }

    // Handle Java/Spring LocalDateTime Array format: [y, m, d, h, m, s]
    if (Array.isArray(rawValue)) {
        try {
            const [year, month, day, hour = 0, minute = 0, second = 0] = rawValue;
            // month is 1-indexed in Java LocalDateTime, but 0-indexed in JS Date
            const date = new Date(year, month - 1, day, hour, minute, second);
            return date.toLocaleString(undefined, options);
        } catch (e) {
            return "Invalid Date Format";
        }
    }

    // Handle strings and numeric epochs
    let normalized = rawValue;
    if (typeof rawValue === 'string') {
        // Remove whitespace and handle common variations
        normalized = rawValue.trim();
        // If it's a "YYYY-MM-DD HH:mm:ss" style format, normalize for Safari/mobile
        normalized = normalized.replace(' ', 'T');

        // Ensure browser compatibility for strings like "2024-02-08T14:30:00" missing offset
        if (normalized.includes('T') && !normalized.includes('Z') && !normalized.includes('+') && !normalized.includes('-')) {
            // Check if it looks like an ISO date but lacks timezone info
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(normalized)) {
                normalized += 'Z'; // Assume UTC if absolutely no zone info
            }
        }
    }

    const date = new Date(normalized);
    return isNaN(date.getTime())
        ? "No date info"
        : date.toLocaleString(undefined, options);
};

/**
 * Returns the appropriate icon component for an activity type.
 * 
 * @param {string} type The activity type (e.g., 'RUNNING', 'WALKING')
 * @param {Object} props Props to pass to the icon component
 * @returns {JSX.Element} Icon component
 */
export const getActivityIcon = (type, props = {}) => {
    const iconProps = { fontSize: 'medium', ...props };
    switch (type?.toUpperCase()) {
        case 'RUNNING': return <DirectionsRunIcon {...iconProps} />;
        case 'WALKING': return <DirectionsWalkIcon {...iconProps} />;
        case 'CYCLING': return <PedalBikeIcon {...iconProps} />;
        default: return <DirectionsRunIcon {...iconProps} />;
    }
};
