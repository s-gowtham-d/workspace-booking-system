import type { Room } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, IndianRupee, Sparkles } from 'lucide-react';

interface RoomCardProps {
    room: Room;
    onSelect?: (room: Room) => void;
    isSelected?: boolean;
}

export default function RoomCard({ room, onSelect, isSelected }: RoomCardProps) {
    const peakRate = room.baseHourlyRate * 1.5;

    return (
        <Card
            className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
            onClick={() => onSelect?.(room)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {room.name}
                            {isSelected && (
                                <Badge variant="default" className="text-xs">
                                    Selected
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Room ID: {room.id}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Capacity: {room.capacity} people</span>
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Base Rate:</span>
                        <div className="flex items-center font-semibold text-base">
                            <IndianRupee className="w-4 h-4" />
                            {room.baseHourlyRate}/hr
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Peak Rate:
                        </span>
                        <div className="flex items-center font-semibold text-base text-orange-600">
                            <IndianRupee className="w-4 h-4" />
                            {peakRate}/hr
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                        Peak hours: Mon-Fri 10 AM-1 PM, 4 PM-7 PM
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}