import { useState } from "react";
import {
    useGetLearnersQuery,
    useToggleUserStatusMutation,
} from "../../features/users/usersApi";
import type { User } from "../../features/users/types";
import Table, { type Column } from "../../components/admin/Table";
import Pagination from "../../components/Pagination";
import Filters from "../../components/Filters";
import LoadingSpinner from "../../components/LoadingSpinner";
import ConfirmationModal from "../../components/ConfirmationModal";
import type { ToastType } from "../../components/Toast";
import Toast from "../../components/Toast";
import AdminUserBillingModal from "../../components/admin/AdminUserBillingModal";

export default function LearnersPage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [toggleData, setToggleData] = useState<{
        learnerId: string | null,
        isActive: boolean
    }>({
        learnerId: null,
        isActive: false
    });
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
    const [isBillingOpen, setIsBillingOpen] = useState(false);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    const { data, isLoading, error } = useGetLearnersQuery({
        page: currentPage,
        limit: 10,
        search,
    });
    const [toggleUserStatus, { isLoading: isDeleting }] = useToggleUserStatusMutation();

    const handleShowConfirmModal = (id: string, isActive: boolean) => {
        setToggleData({
            learnerId: id,
            isActive
        });

        setShowModal(true);
    }

    const handleDelete = async () => {
        try {
            await toggleUserStatus(toggleData.learnerId).unwrap();

            showToast("Toggle status success", "success");
        } catch (err) {
            showToast("Toggle status failed", "error");
        }

        setShowModal(false);
    };

    const sortedLearners = [...(data?.data || [])].sort((a, b) => {
        if (sort === "joined") {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        }

        if (sort === "name") {
            return a.name.localeCompare(b.name);
        }

        return 0;
    });

    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="h-[60vh] flex justify-center items-center">
                <p className="text-red-500">Failed to load learners</p>
            </div>
        );
    }

    const columns: Column<User>[] = [
        { header: "Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        {
            header: "Joined",
            accessor: "createdAt",
            render: (value: string) => new Date(value).toLocaleDateString(),
        },
    ];

    return (
        <div>
            {/* Header */}
            <h1 className="text-2xl font-bold mb-6">Learners</h1>

            <Filters
                search={search}
                setSearch={setSearch}
                searchPlaceholder="🔍 Search learners..."
                setSort={setSort}
                sort={sort}
                sortOptions={[
                    { value: "", label: "Sort By" },
                    { value: "name", label: "Name" },
                    { value: "joined", label: "Joined Date" },
                ]}
            />

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <Table
                    columns={columns}
                    data={sortedLearners}
                    renderActions={(user) => (
                        <div className="flex items-center justify-end gap-3 w-full">
                            {/* Billing Ledger Button */}
                            <button
                                onClick={() => {
                                    setSelectedUser({ id: user._id, name: user.name });
                                    setIsBillingOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 active:bg-indigo-200 transition-colors cursor-pointer shrink-0"
                            >
                                <span>View Ledger</span>
                                <span>💳</span>
                            </button>

                            {/* Status Toggle Button */}
                            <button
                                onClick={() => handleShowConfirmModal(user._id, user.isActive)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer shrink-0 min-w-[85px] text-center ${user.isActive
                                        ? "text-red-600 bg-red-50 border-red-100 hover:bg-red-100 active:bg-red-200"
                                        : "text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100 active:bg-emerald-200"
                                    }`}
                            >
                                {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                        </div>
                    )}
                />
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                setCurrentPage={setCurrentPage}
                marginTop="mt-6"
            />

            {selectedUser && (
                <AdminUserBillingModal
                    isOpen={isBillingOpen}
                    onClose={() => {
                        setIsBillingOpen(false);
                        setSelectedUser(null);
                    }}
                    userId={selectedUser.id}
                    userName={selectedUser.name}
                />
            )}

            <ConfirmationModal
                isOpen={showModal}
                isLoading={isLoading || isDeleting}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
                title={toggleData.isActive ? "Deactivate Learner Profile" : "Activate Learner Profile"}
                message={toggleData.isActive
                    ? "Deactivating this profile suspends the user's login access rights and pauses active certificate metrics until reinstated."
                    : "Activating this profile completely restores full login capability, platform access, and course progress records."}
                confirmLabel={toggleData.isActive ? "Deactivate User" : "Activate User"}
                cancelLabel="Go Back"
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
