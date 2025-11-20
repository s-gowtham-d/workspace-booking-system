import { useState } from 'react';
import type { Room, CreateBookingRequest } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { bookingApi, handleApiError } from '@/services/api';
import { getMinDateTime, dateTimeLocalToISO, calculateDuration } from '@/lib/dateUtils';
import { CheckCircle2, AlertCircle, IndianRupee, Clock } from 'lucide-react';

interface BookingFormProps {
    selectedRoom: Room | null;
}

export default function BookingForm({ selectedRoom }: BookingFormProps) {
    const [formData, setFormData] = useState({
        userName: '',
        startTime: '',
        endTime: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRoom) {
            setError('Please select a room first');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const bookingRequest: CreateBookingRequest = {
                roomId: selectedRoom.id,
                userName: formData.userName,
                startTime: dateTimeLocalToISO(formData.startTime),
                endTime: dateTimeLocalToISO(formData.endTime),
            };

            const response = await bookingApi.createBooking(bookingRequest);

            setSuccess(
                `Booking confirmed! Total price: ₹${response.totalPrice}. Booking ID: ${response.bookingId}`
            );

            // Reset form
            setFormData({
                userName: '',
                startTime: '',
                endTime: '',
            });
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(null);
        setSuccess(null);
    };

    const duration =
        formData.startTime && formData.endTime
            ? calculateDuration(
                dateTimeLocalToISO(formData.startTime),
                dateTimeLocalToISO(formData.endTime)
            )
            : 0;

    const estimatedPrice =
        selectedRoom && duration > 0
            ? Math.round(selectedRoom.baseHourlyRate * duration * 1.25) // Rough estimate considering potential peak hours
            : 0;

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle>Book This Room</CardTitle>
                <CardDescription>
                    {selectedRoom
                        ? `Booking ${selectedRoom.name}`
                        : 'Select a room to start booking'}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {!selectedRoom ? (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please select a room from the list to continue with your booking.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Your Name</Label>
                            <Input
                                id="userName"
                                name="userName"
                                type="text"
                                placeholder="Enter your name"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                id="startTime"
                                name="startTime"
                                type="datetime-local"
                                min={getMinDateTime()}
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                                id="endTime"
                                name="endTime"
                                type="datetime-local"
                                min={formData.startTime || getMinDateTime()}
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        {duration > 0 && (
                            <div className="p-3 bg-muted rounded-lg space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        Duration
                                    </span>
                                    <span className="font-semibold">{duration.toFixed(2)} hours</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <IndianRupee className="w-4 h-4" />
                                        Estimated Price
                                    </span>
                                    <span className="font-semibold text-primary">
                                        ₹{estimatedPrice}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    * Final price may vary based on peak hours
                                </p>
                            </div>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}