import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useGetProfileQuery, useVerifyStripeSessionMutation } from "../features/users/usersApi";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const sessionId = searchParams.get("session_id");
    const isFree = searchParams.get("mode") === "free";

    const [verifySession, { isLoading }] = useVerifyStripeSessionMutation();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    // Re-fetch or refetch user profile to ensure RTK Query cache has the new enrollment array
    const { refetch } = useGetProfileQuery();

    useEffect(() => {
        // Trigger a fresh background profile fetch so navigation state updates instantly
        refetch();
    }, [refetch]);

    useEffect(() => {
        // If there's no session_id in the URL, reject access immediately
        if (!sessionId) {
            setIsValid(false);
            return;
        }

        const runVerification = async () => {
            try {
                const response = await verifySession({ sessionId }).unwrap();
                if (response.success) {
                    setIsValid(true);
                } else {
                    setIsValid(false);
                }
            } catch (err) {
                setIsValid(false);
            }
        };

        runVerification();
    }, [sessionId, verifySession]);

    // Loading State while checking database
    if (isLoading || isValid === null) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-medium text-gray-500">Verifying secure checkout records...</p>
            </div>
        );
    }

    // Error State: Renders if they access the path directly or use a fake session_id
    if (!isValid) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                    <p className="text-sm text-gray-500 mb-6">
                        We couldn't find a valid purchase matching this session context. Direct access to this secure checkpoint is restricted.
                    </p>
                    <button
                        onClick={() => navigate("/courses")}
                        className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition text-sm"
                    >
                        Return to Catalog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">

                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 animate-bounce">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                    Enrolled Successfully!
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    {isFree
                        ? "Your free course access has been activated. Ready to start learning?"
                        : "Payment processed securely. Your workspace access has been fully provisioned."
                    }
                </p>

                {sessionId && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-8 border border-gray-100">
                        <span className="block text-[11px] font-mono uppercase tracking-wider text-gray-400">
                            Transaction Reference String
                        </span>
                        <span className="font-mono text-xs text-gray-600 break-all select-all block mt-0.5">
                            {sessionId}
                        </span>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/dashboard/my-courses")}
                        className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm tracking-wide"
                    >
                        Go To My Classroom Dashboard →
                    </button>

                    <Link
                        to="/courses"
                        className="text-xs text-gray-500 hover:text-purple-600 font-medium transition py-1"
                    >
                        Browse Other Available Directories
                    </Link>
                </div>

            </div>
        </div>
    );
}
