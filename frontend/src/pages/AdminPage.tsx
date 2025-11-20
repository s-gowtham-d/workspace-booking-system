import { useState, useEffect } from 'react';
import { type RoomAnalytics } from '@/types';
import { analyticsApi, handleApiError } from '@/services/api';
import { getDefaultDateRange, formatDateForAPI } from '@/lib/analyticsUtils';
import StatsCard from '@/components/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    LayoutDashboard,
    TrendingUp,
    IndianRupee,
    Clock,
    Building2,
    AlertCircle,
    Loader2,
    Calendar,
    BarChart3,
} from 'lucide-react';

export default function AdminPage() {
    const defaultRange = getDefaultDateRange();
    const [dateRange, setDateRange] = useState(defaultRange);
    const [analytics, setAnalytics] = useState<RoomAnalytics[]>([]);
    const [overallStats, setOverallStats] = useState<any>(null);
    const [utilizationMetrics, setUtilizationMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const [analyticsData, statsData, metricsData] = await Promise.all([
                analyticsApi.getAnalytics(dateRange.from, dateRange.to),
                analyticsApi.getOverallStats(dateRange.from, dateRange.to),
                analyticsApi.getUtilizationMetrics(dateRange.from, dateRange.to),
            ]);

            setAnalytics(analyticsData);
            setOverallStats(statsData);
            setUtilizationMetrics(metricsData);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value,
        });
    };

    const handleApplyFilter = () => {
        fetchAnalytics();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Analytics and insights for workspace bookings</p>
                    </div>
                </div>

                {/* Date Range Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Date Range
                        </CardTitle>
                        <CardDescription>Select a date range to view analytics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="from">From Date</Label>
                                <Input
                                    id="from"
                                    name="from"
                                    type="date"
                                    value={dateRange.from}
                                    onChange={handleDateChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="to">To Date</Label>
                                <Input
                                    id="to"
                                    name="to"
                                    type="date"
                                    value={dateRange.to}
                                    onChange={handleDateChange}
                                    min={dateRange.from}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button onClick={handleApplyFilter} disabled={loading} className="w-full">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <BarChart3 className="w-4 h-4 mr-2" />
                                            Apply Filter
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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

            {/* Analytics Dashboard */}
            {!loading && !error && overallStats && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Revenue"
                            value={`₹${overallStats.summary.totalRevenue.toLocaleString()}`}
                            icon={IndianRupee}
                            description="Confirmed bookings only"
                        />
                        <StatsCard
                            title="Total Hours Booked"
                            value={overallStats.summary.totalHours.toFixed(1)}
                            icon={Clock}
                            description="Across all rooms"
                        />
                        <StatsCard
                            title="Active Rooms"
                            value={`${overallStats.summary.activeRooms}/${overallStats.summary.totalRooms}`}
                            icon={Building2}
                            description="Rooms with bookings"
                        />
                        <StatsCard
                            title="Average Revenue/Room"
                            value={`₹${overallStats.summary.averageRevenuePerRoom.toLocaleString()}`}
                            icon={TrendingUp}
                            description="Per room in period"
                        />
                    </div>

                    {/* Utilization Metrics */}
                    {utilizationMetrics && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Utilization Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-muted rounded-lg">
                                        <div className="text-2xl font-bold">{utilizationMetrics.totalBookings}</div>
                                        <div className="text-sm text-muted-foreground mt-1">Total Bookings</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {utilizationMetrics.confirmedBookings}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">Confirmed</div>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">
                                            {utilizationMetrics.cancelledBookings}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">Cancelled</div>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {utilizationMetrics.cancellationRate}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">Cancellation Rate</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Room-wise Analytics Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Room Performance</CardTitle>
                            <CardDescription>
                                Revenue and utilization breakdown by room
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rank</TableHead>
                                            <TableHead>Room</TableHead>
                                            <TableHead>Total Hours</TableHead>
                                            <TableHead>Total Revenue</TableHead>
                                            <TableHead>Avg. Revenue/Hour</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analytics.map((room, index) => {
                                            const avgRevenuePerHour =
                                                room.totalHours > 0
                                                    ? (room.totalRevenue / room.totalHours).toFixed(0)
                                                    : 0;

                                            return (
                                                <TableRow key={room.roomId}>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                                            {index + 1}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{room.roomName}</TableCell>
                                                    <TableCell>{room.totalHours.toFixed(2)} hrs</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center font-semibold">
                                                            <IndianRupee className="w-4 h-4" />
                                                            {room.totalRevenue.toLocaleString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center text-muted-foreground">
                                                            <IndianRupee className="w-3 h-3" />
                                                            {avgRevenuePerHour}/hr
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {room.totalHours > 0 ? (
                                                            <Badge variant="success">Active</Badge>
                                                        ) : (
                                                            <Badge variant="outline">Inactive</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>

                                {analytics.length === 0 && (
                                    <div className="text-center py-12">
                                        <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">
                                            No analytics data available for the selected date range
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}