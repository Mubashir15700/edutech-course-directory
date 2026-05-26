const LoadingSpinner = () => {
    return (
        <div className="min-h-[calc(80vh-64px)] w-full flex items-center justify-center bg-gray-50/50">
            <div className="relative flex items-center justify-center">
                {/* Inner glowing core spinner */}
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            </div>
        </div>
    )
}

export default LoadingSpinner;
