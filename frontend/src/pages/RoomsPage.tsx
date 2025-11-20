import { useState, useEffect } from 'react';
import type { Room } from '@/types';
import { roomApi, handleApiError } from '@/services/api';
import RoomCard from '@/components/RoomCard';
import BookingForm from '@/components/BookingForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Home } from 'lucide-react';

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await roomApi.getAllRooms();
            setRooms(data);
            setError(null);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleRoomSelect = (room: Room) => {
        setSelectedRoom(room);
        // Scroll to form on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                document.getElementById('booking-form')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Meeting Rooms</h1>
                        <p className="text-muted-foreground">
                            Choose a room and book your time slot
                        </p>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {/* Error State */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Main Content */}
            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Rooms List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Available Rooms ({rooms.length})
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rooms.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    onSelect={handleRoomSelect}
                                    isSelected={selectedRoom?.id === room.id}
                                />
                            ))}
                        </div>

                        {rooms.length === 0 && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    No rooms available at the moment. Please check back later.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Booking Form */}
                    <div className="lg:col-span-1" id="booking-form">
                        <BookingForm selectedRoom={selectedRoom} />
                    </div>
                </div>
            )}
        </div>
    );
}