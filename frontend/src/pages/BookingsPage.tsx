import { useState, useEffect } from 'react';
import { type Booking, BookingStatus, type Room } from '@/types';
import { bookingApi, roomApi, handleApiError } from '@/services/api';
import BookingCard from '@/components/BookingCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatTime } from '@/lib/dateUtils';
import { AlertCircle, Loader2, Calendar, RefreshCcw, IndianRupee } from 'lucide-react';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bookingsData, roomsData] = await Promise.all([
                bookingApi.getAllBookings(),
                roomApi.getAllRooms(),
            ]);
            setBookings(bookingsData);
            setRooms(roomsData);
            setError(null);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const getRoomName = (roomId: string): string => {
        const room = rooms.find((r) => r.id === roomId);
        return room ? room.name : roomId;
    };

    const handleCancelClick = (booking: Booking) => {
        setBookingToCancel(booking);
        setCancelDialogOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!bookingToCancel) return;

        try {
            setCancelling(true);
            await bookingApi.cancelBooking(bookingToCancel.id);

            // Update the booking in the list
            setBookings(
                bookings.map((b) =>
                    b.id === bookingToCancel.id ? { ...b, status: BookingStatus.CANCELLED } : b
                )
            );

            setCancelDialogOpen(false);
            setBookingToCancel(null);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setCancelling(false);
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === 'all') return true;
        if (filter === 'confirmed') return booking.status === BookingStatus.CONFIRMED;
        if (filter === 'cancelled') return booking.status === BookingStatus.CANCELLED;
        return true;
    });

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === BookingStatus.CONFIRMED).length,
        cancelled: bookings.filter((b) => b.status === BookingStatus.CANCELLED).length,
        totalRevenue: bookings
            .filter((b) => b.status === BookingStatus.CONFIRMED)
            .reduce((sum, b) => sum + b.totalPrice, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
                        <p className="text-muted-foreground">View and manage your bookings</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground mb-1">Total</div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground mb-1">Confirmed</div>
                        <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground mb-1">Cancelled</div>
                        <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground mb-1">Revenue</div>
                        <div className="text-2xl font-bold flex items-center">
                            <IndianRupee className="w-5 h-5" />
                            {stats.totalRevenue}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Refresh */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        All ({stats.total})
                    </Button>
                    <Button
                        variant={filter === 'confirmed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('confirmed')}
                    >
                        Confirmed ({stats.confirmed})
                    </Button>
                    <Button
                        variant={filter === 'cancelled' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('cancelled')}
                    >
                        Cancelled ({stats.cancelled})
                    </Button>
                </div>

                <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
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

            {/* Bookings List */}
            {!loading && !error && (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Room</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.map((booking) => {
                                    const isCancelled = booking.status === BookingStatus.CANCELLED;
                                    const isPast = new Date(booking.endTime) < new Date();

                                    return (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">
                                                {getRoomName(booking.roomId)}
                                            </TableCell>
                                            <TableCell>{booking.userName}</TableCell>
                                            <TableCell>{formatDate(booking.startTime)}</TableCell>
                                            <TableCell className="text-sm">
                                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center font-semibold">
                                                    <IndianRupee className="w-4 h-4" />
                                                    {booking.totalPrice}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={isCancelled ? 'destructive' : 'success'}>
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {!isCancelled && !isPast ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCancelClick(booking)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                ) : isPast && !isCancelled ? (
                                                    <span className="text-xs text-muted-foreground">Ended</span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {filteredBookings.length === 0 && (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No bookings found</p>
                            </div>
                        )}
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                roomName={getRoomName(booking.roomId)}
                                onCancel={handleCancelClick}
                                cancelling={cancelling && bookingToCancel?.id === booking.id}
                            />
                        ))}

                        {filteredBookings.length === 0 && (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No bookings found</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Cancel Confirmation Dialog */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent onClose={() => setCancelDialogOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {bookingToCancel && (
                        <div className="space-y-2 py-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Room:</span>
                                <span className="font-medium">{getRoomName(bookingToCancel.roomId)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">{formatDate(bookingToCancel.startTime)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Time:</span>
                                <span className="font-medium">
                                    {formatTime(bookingToCancel.startTime)} -{' '}
                                    {formatTime(bookingToCancel.endTime)}
                                </span>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCancelDialogOpen(false)}
                            disabled={cancelling}
                        >
                            Keep Booking
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancelConfirm}
                            disabled={cancelling}
                        >
                            {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}