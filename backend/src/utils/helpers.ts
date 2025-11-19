import { randomBytes } from 'crypto';

/**
 * Generate a unique ID
 */
export const generateId = (prefix: string = ''): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = randomBytes(4).toString('hex');
    return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;
};

/**
 * Check if a date string is valid ISO format
 */
export const isValidISODate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && dateString === date.toISOString();
};

/**
 * Calculate hours between two dates
 */
export const calculateHours = (startTime: Date, endTime: Date): number => {
    const diffMs = endTime.getTime() - startTime.getTime();
    return diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
};

/**
 * Format date to Asia/Kolkata timezone
 */
export const formatToIST = (date: Date): string => {
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Check if two time ranges overlap
 */
export const doTimeRangesOverlap = (
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
): boolean => {
    // Ranges overlap if: start1 < end2 AND end1 > start2
    return start1 < end2 && end1 > start2;
};

/**
 * Parse date string to Date object with validation
 */
export const parseDate = (dateString: string): Date => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: ${dateString}`);
    }
    return date;
};