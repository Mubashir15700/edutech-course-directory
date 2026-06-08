const QuizLoading = () => {
    return (
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border border-slate-200" />
            <div className="absolute inset-3 rounded-full border border-slate-100" />

            <div className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500" />

            <div className="absolute inset-0 animate-[spin_2s_linear_infinite]">
                <div className="absolute left-1/2 top-0 w-2 h-2 -translate-x-1/2 rounded-full bg-blue-400" />
            </div>

            <div className="absolute inset-3 animate-[spin_1.3s_linear_infinite_reverse]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-500" />
            </div>
        </div>
    );
};

export default QuizLoading;
