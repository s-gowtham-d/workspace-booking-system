import { format, parseISO } from 'date-fns';

/**
 * Format date to datetime-local input format (YYYY-MM-DDTHH:mm)
 */
export const formatToDateTimeLocal = (date: Date): string => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
};

/**
 * Get minimum datetime for booking (current time)
 */
export const getMinDateTime = (): string => {
    const now = new Date();
    return formatToDateTimeLocal(now);
};

/**
 * Format ISO date to readable format
 */
export const formatDateTime = (isoString: string): string => {
    try {
        const date = parseISO(isoString);
        return format(date, 'MMM dd, yyyy h:mm a');
    } catch (error) {
        return isoString;
    }
};

/**
 * Format date only
 */
export const formatDate = (isoString: string): string => {
    try {
        const date = parseISO(isoString);
        return format(date, 'MMM dd, yyyy');
    } catch (error) {
        return isoString;
    }
};

/**
 * Format time only
 */
export const formatTime = (isoString: string): string => {
    try {
        const date = parseISO(isoString);
        return format(date, 'h:mm a');
    } catch (error) {
        return isoString;
    }
};

/**
 * Convert datetime-local input to ISO string
 */
export const dateTimeLocalToISO = (dateTimeLocal: string): string => {
    const date = new Date(dateTimeLocal);
    return date.toISOString();
};

/**
 * Calculate duration in hours
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60);
};