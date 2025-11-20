import { type Booking, BookingStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime } from '@/lib/dateUtils';
import { Calendar, User, MapPin, IndianRupee, XCircle } from 'lucide-react';

interface BookingCardProps {
    booking: Booking;
    roomName?: string;
    onCancel: (booking: Booking) => void;
    cancelling: boolean;
}

export default function BookingCard({ booking, roomName, onCancel, cancelling }: BookingCardProps) {
    const isCancelled = booking.status === BookingStatus.CANCELLED;
    const isPast = new Date(booking.endTime) < new Date();

    return (
        <Card className={isCancelled ? 'opacity-60' : ''}>
            <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">{roomName || booking.roomId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>{booking.userName}</span>
                        </div>
                    </div>
                    <Badge variant={isCancelled ? 'destructive' : 'success'}>
                        {booking.status}
                    </Badge>
                </div>

                {/* Date and Time */}
                <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-start gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <div className="font-medium">{formatDate(booking.startTime)}</div>
                            <div className="text-muted-foreground">
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Total Price</span>
                    <div className="flex items-center font-semibold text-lg">
                        <IndianRupee className="w-4 h-4" />
                        {booking.totalPrice}
                    </div>
                </div>

                {/* Action */}
                {!isCancelled && !isPast && (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => onCancel(booking)}
                        disabled={cancelling}
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                    </Button>
                )}

                {isPast && !isCancelled && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                        This booking has ended
                    </div>
                )}
            </CardContent>
        </Card>
    );
}