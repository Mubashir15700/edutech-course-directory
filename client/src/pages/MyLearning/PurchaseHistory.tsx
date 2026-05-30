import Table, { type Column } from "../../components/admin/Table";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { PaymentHistory } from "../../features/users/types";
import { useGetPaymentHistoryQuery } from "../../features/users/usersApi";

const PurchaseHistory = () => {
    const { data, isLoading, isError } = useGetPaymentHistoryQuery();

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500"><LoadingSpinner /></div>;
    }

    if (isError) {
        return <div className="p-8 text-center text-red-500">Failed to fetch transactions.</div>;
    }

    const purchases = data || [];

    const totalSpent = purchases.reduce((sum: number, tx: any) => sum + tx.amountPaid, 0);

    const columns: Column<PaymentHistory>[] = [
        {
            header: "Course Title",
            accessor: "courseName",
            render: (value, row) => (
                <div className="flex items-center gap-3 max-w-xs">
                    <img
                        src={row.thumbnail}
                        alt=""
                        className="w-12 h-8 rounded-md object-cover border border-slate-200/60 shadow-sm shrink-0"
                    />
                    <span className="truncate block font-medium text-slate-900" title={value}>
                        {value}
                    </span>
                </div>
            )
        },
        {
            header: "Purchase Date",
            accessor: "purchaseDate",
            render: (value) => (
                <span className="text-slate-500">
                    {new Date(value).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            )
        },
        {
            header: "Stripe Receipt Reference",
            accessor: "receiptRef",
            render: (value) => (
                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200 select-all" title={value}>
                    {value ? `${value.substring(0, 16)}...` : "N/A"}
                </span>
            )
        },
        {
            header: "Status",
            accessor: "id", // Use any key here since we are overriding with a static component badge
            render: () => (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Success
                </span>
            )
        },
        {
            header: "Amount",
            accessor: "amountPaid",
            render: (value) => (
                <div className="text-right font-bold text-slate-900">
                    ${value.toFixed(2)}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Top Metric Highlight Box */}
            {purchases.length > 0 && (
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 text-white flex justify-between items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                            Total Educational Investment
                        </p>
                        <h3 className="text-3xl font-extrabold mt-1 tracking-tight">
                            ${totalSpent.toFixed(2)}
                        </h3>
                    </div>
                    <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 text-indigo-400">
                        💳 Verified Student Wallet
                    </div>
                </div>
            )}

            {/* Main Ledger Table Module */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Billing History</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        View financial transaction references, dates, and active course access receipts.
                    </p>
                </div>

                {purchases.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p className="font-medium">You haven't purchased any courses yet.</p>
                        <p className="text-xs text-slate-400 mt-1">When you buy a course, invoices appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table columns={columns} data={purchases} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default PurchaseHistory