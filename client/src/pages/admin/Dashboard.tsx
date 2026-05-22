import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useGetDashboardStatsQuery } from "../../features/dashboard/dashboardApi";
import Table, { type Column } from "../../components/admin/Table"; // Adjust this import path to match your file structure
// Define the interface for a Sale record to ensure full type-safety
interface SaleRecord {
    _id: string;
    user: {
        name: string;
        email: string;
    } | null;
    course: {
        name: string;
    } | null;
    amountPaid: number;
    createdAt: string;
}

export default function Dashboard() {
    const { data, isLoading } = useGetDashboardStatsQuery();

    const totalCourses = data?.totalCourses || 0;
    const totalLearners = data?.totalLearners || 0;
    const activeUsers = data?.activeUsers || 0;
    const totalRevenue = data?.totalRevenue || 0;
    const recentSales: SaleRecord[] = data?.recentSales || [];
    const chartData = data?.chartData || [];

    // Define columns config using your custom Table configuration rules
    const columns: Column<SaleRecord>[] = [
        {
            header: "Customer Details",
            accessor: "user",
            render: (_, row) => (
                <div>
                    <div className="font-semibold text-gray-900">{row.user?.name || "Deleted User"}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{row.user?.email || "N/A"}</div>
                </div>
            )
        },
        {
            header: "Course Track",
            accessor: "course",
            render: (_, row) => (
                <span className="font-medium text-gray-800">
                    {row.course?.name || "Deleted Catalog Item"}
                </span>
            )
        },
        {
            header: "Amount Deposited",
            accessor: "amountPaid",
            render: (value) => (
                <span className="inline-block font-mono bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold text-xs">
                    ${Number(value).toFixed(2)}
                </span>
            )
        },
        {
            header: "Timestamp",
            accessor: "createdAt",
            render: (value) => (
                <span className="text-gray-400 font-medium text-xs">
                    {new Date(value).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </span>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-120px)] flex justify-center items-center">
                <p className="text-lg font-semibold">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="h-[80vh] max-h-[80vh] overflow-y-auto pr-2">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

            {/* Metrics Counters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Courses</p>
                    <h3 className="text-3xl font-bold mt-2">{totalCourses}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Learners</p>
                    <h3 className="text-3xl font-bold mt-2">{totalLearners}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Active Users</p>
                    <h3 className="text-3xl font-bold mt-2">{activeUsers}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Gross Earnings</p>
                        <h3 className="text-3xl font-bold mt-2 text-green-600">
                            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-gray-50 mt-10">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Growth Analysis & Volume Trends</h3>
                    <p className="text-xs text-gray-400 mt-0.5">A 7-day comparative analysis mapping daily earnings against checkout frequencies.</p>
                </div>

                <div className="h-80 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="date" stroke="#9CA3AF" tickLine={false} />
                            <YAxis yAxisId="left" stroke="#10B981" tickLine={false} label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', offset: 10, fill: '#9CA3AF' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#8B5CF6" tickLine={false} label={{ value: 'Enrollments', angle: 90, position: 'insideRight', offset: 10, fill: '#9CA3AF' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #F3F4F6' }} />
                            <Legend verticalAlign="top" height={36} />
                            <Area yAxisId="left" type="monotone" dataKey="Revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area yAxisId="right" type="monotone" dataKey="Enrollments" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorEnrollments)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Reused Table Section Layout */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Recent Checkout Event Log</h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Live Webhook Synced</span>
                </div>

                {/* Placed your custom table component directly here using setup properties */}
                <Table
                    columns={columns}
                    data={recentSales}
                />
            </div>
        </div>
    );
}
