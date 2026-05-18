export type Column<T> = {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T> = {
    columns: Column<T>[];
    data: T[];
    renderActions?: (row: T) => React.ReactNode;
};

export default function Table<T>({
    columns,
    data,
    renderActions,
}: TableProps<T>) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className="p-4">
                                {col.header}
                            </th>
                        ))}
                        {renderActions && <th className="p-4 text-right">Actions</th>}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row: any, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="p-4">
                                    {col.render
                                        ? col.render(row[col.accessor], row)
                                        : row[col.accessor]}
                                </td>
                            ))}

                            {renderActions && (
                                <td className="p-4 text-right">
                                    {renderActions(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {data.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                    No data available
                </div>
            )}
        </div>
    );
}
