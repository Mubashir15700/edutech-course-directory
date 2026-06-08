const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative h-16 w-16 animate-spin [animation-duration:3s]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-blue-500" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-indigo-500" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-cyan-500" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-violet-500" />

                <div className="absolute inset-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg" />
            </div>
        </div>
    );
};

export default LoadingSpinner;
