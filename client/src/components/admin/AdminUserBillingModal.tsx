import { useEffect } from "react";
import { useGetAdminUserBillingQuery } from "../../features/users/usersApi";
import type { AdminPaymentHistory } from "../../features/users/types";
import Table, { type Column } from "./Table";

interface AdminUserBillingModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
}

export default function AdminUserBillingModal({
    isOpen,
    onClose,
    userId,
    userName,
}: AdminUserBillingModalProps) {

    // Native 'Escape' key closer mechanism from your codebase
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Fetch the specific user's logs automatically when the modal opens
    const { data, isLoading, isError } = useGetAdminUserBillingQuery(userId, {
        skip: !isOpen || !userId, // Skip execution if the modal is hidden
    });

    if (!isOpen) return null;

    const history: AdminPaymentHistory[] = data || [];
    const lifetimeValue = history.reduce((sum, tx) => sum + tx.amountPaid, 0);

    // Table columns configuration mapping
    const columns: Column<AdminPaymentHistory>[] = [
        {
            header: "Course Purchased",
            accessor: "courseName",
            render: (value) => <span className="font-semibold text-slate-900">{value}</span>
        },
        {
            header: "Transaction Date",
            accessor: "purchaseDate",
            render: (value) => (
                <span className="text-gray-500">
                    {new Date(value).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    })}
                </span>
            )
        },
        {
            header: "Stripe Token",
            accessor: "stripeRef",
            render: (value) => (
                <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 border rounded select-all" title={value}>
                    {value ? `${value.substring(0, 16)}...` : "Manual/Free"}
                </span>
            )
        },
        {
            header: "Revenue Captured",
            accessor: "amountPaid",
            render: (value) => (
                <span className="font-bold text-slate-900">${value.toFixed(2)}</span>
            )
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Card - Set to max-w-4xl for comfortable table view widths */}
            <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl transition-all scale-100 animate-slide-up flex flex-col gap-5">

                {/* Header Layout */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Financial Audit Logs</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Showing billing ledger details for: <span className="font-semibold text-indigo-600">{userName}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-50 rounded-lg font-bold text-sm"
                    >
                        ✕ Close
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-gray-500 animate-pulse">Gathering student master logs...</div>
                ) : isError ? (
                    <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">Error loading logs.</div>
                ) : (
                    <>
                        {/* LTV Value Card Banner */}
                        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 rounded-xl text-white flex justify-between items-center shadow-inner">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Student Lifetime Value (LTV)</p>
                                <p className="text-3xl font-black mt-0.5 text-emerald-400">${lifetimeValue.toFixed(2)}</p>
                            </div>
                            <div className="text-right text-xs text-indigo-200 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                                Paid Courses Access: <span className="text-white font-bold">{history.length}</span>
                            </div>
                        </div>

                        {/* Reused Generic Custom Table Component */}
                        <div className="max-h-[350px] overflow-y-auto rounded-xl border border-gray-150">
                            <Table columns={columns} data={history} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
