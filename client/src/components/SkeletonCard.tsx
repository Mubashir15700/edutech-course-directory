const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 animate-pulse">
        <div className="h-40 bg-gray-100 rounded-xl w-full" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2 pt-2">
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
        <div className="border-t border-gray-50 pt-4 flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/6" />
        </div>
    </div>
);

export default SkeletonCard;
