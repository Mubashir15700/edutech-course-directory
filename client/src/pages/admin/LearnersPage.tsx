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

export default function LearnersPage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error } = useGetLearnersQuery({
        page: currentPage,
        limit: 10,
        search,
    });
    const [toggleUserStatus, { isLoading: isDeleting }] = useToggleUserStatusMutation();

    const handleDelete = async (id: string) => {
        if (!window.confirm("Toggle this learner's status?")) return;

        try {
            await toggleUserStatus(id).unwrap();
        } catch (err) {
            console.error("Toggle status failed", err);
        }
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
                        <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600"
                        >
                            {isDeleting ? "Toggling..." : user.isActive ? "Deactivate" : "Activate"}
                        </button>
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
        </div>
    );
}
