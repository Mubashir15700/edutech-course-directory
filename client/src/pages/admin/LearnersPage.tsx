import {
    useGetLearnersQuery,
    useDeleteUserMutation,
} from "../../features/users/usersApi";
import type { User } from "../../features/users/types";
import Table, { type Column } from "../../components/admin/Table";

export default function LearnersPage() {
    const { data, isLoading, error } = useGetLearnersQuery();
    const [deleteUser, { isLoading: isDeleting }] =
        useDeleteUserMutation();

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this learner?")) return;

        try {
            await deleteUser(id).unwrap();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex justify-center items-center">
                <p className="text-lg">Loading learners...</p>
            </div>
        );
    }

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
            render: (value: string) =>
                new Date(value).toLocaleDateString(),
        },
    ];

    return (
        <div>
            {/* Header */}
            <h1 className="text-2xl font-bold mb-6">Learners</h1>

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <Table
                    columns={columns}
                    data={data?.data || []}
                    renderActions={(user) => (
                        <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    )}
                />

                {/* Empty state */}
                {data?.data.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No learners found
                    </div>
                )}
            </div>
        </div>
    );
}
