import axios, { AxiosError } from 'axios';
import type { Room, Booking, CreateBookingRequest, CreateBookingResponse, RoomAnalytics } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Error handler
export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;
        return axiosError.response?.data?.error || 'An unexpected error occurred';
    }
    return 'An unexpected error occurred';
};

// Room APIs
export const roomApi = {
    getAllRooms: async (): Promise<Room[]> => {
        const response = await api.get<Room[]>('/rooms');
        return response.data;
    },

    getRoomById: async (id: string): Promise<Room> => {
        const response = await api.get<Room>(`/rooms/${id}`);
        return response.data;
    },
};

// Booking APIs
export const bookingApi = {
    createBooking: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
        const response = await api.post<CreateBookingResponse>('/bookings', data);
        return response.data;
    },

    getAllBookings: async (): Promise<Booking[]> => {
        const response = await api.get<Booking[]>('/bookings');
        return response.data;
    },

    getBookingById: async (id: string): Promise<Booking> => {
        const response = await api.get<Booking>(`/bookings/${id}`);
        return response.data;
    },

    cancelBooking: async (id: string): Promise<{ message: string; booking: Booking }> => {
        const response = await api.post(`/bookings/${id}/cancel`);
        return response.data;
    },
};

// Analytics APIs
export const analyticsApi = {
    getAnalytics: async (from: string, to: string): Promise<RoomAnalytics[]> => {
        const response = await api.get<RoomAnalytics[]>('/analytics', {
            params: { from, to },
        });
        return response.data;
    },

    getOverallStats: async (from: string, to: string) => {
        const response = await api.get('/analytics/overview', {
            params: { from, to },
        });
        return response.data;
    },

    getUtilizationMetrics: async (from: string, to: string) => {
        const response = await api.get('/analytics/utilization', {
            params: { from, to },
        });
        return response.data;
    },
};

export default api;