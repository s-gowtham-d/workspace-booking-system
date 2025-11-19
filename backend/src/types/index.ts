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
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status: BookingStatus;
    createdAt: Date;
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

export interface AnalyticsQuery {
    from: string;
    to: string;
}

export interface RoomAnalytics {
    roomId: string;
    roomName: string;
    totalHours: number;
    totalRevenue: number;
}

export interface ErrorResponse {
    error: string;
}