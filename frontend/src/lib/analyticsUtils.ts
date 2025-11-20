import { format, subDays } from 'date-fns';

/**
 * Get default date range (last 7 days)
 */
export const getDefaultDateRange = () => {
    const to = new Date();
    const from = subDays(to, 7);

    return {
        from: format(from, 'yyyy-MM-dd'),
        to: format(to, 'yyyy-MM-dd'),
    };
};

/**
 * Format date for API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

/**
 * Parse date from input
 */
export const parseDateFromInput = (dateString: string): Date => {
    return new Date(dateString);
};