export interface Room {
    id: string;
    name: string;
    baseHourlyRate: number;
    capacity: number;
}

export enum BookingStatus {
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED'
}

export interface Booking {
    id: string;
    roomId: string;
    userName: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: BookingStatus;
    createdAt: string;
}

export interface CreateBookingRequest {
    roomId: string;
    userName: string;
    startTime: string;
    endTime: string;
}

export interface CreateBookingResponse {
    bookingId: string;
    roomId: string;
    userName: string;
    totalPrice: number;
    status: BookingStatus;
}

export interface RoomAnalytics {
    roomId: string;
    roomName: string;
    totalHours: number;
    totalRevenue: number;
}

export interface ApiError {
    error: string;
} 