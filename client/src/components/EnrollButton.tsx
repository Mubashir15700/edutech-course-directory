import { useNavigate } from "react-router-dom";
import { useCreateCheckoutSessionMutation, useGetProfileQuery } from "../features/users/usersApi";

interface EnrollButtonProps {
    courseId: string;
    isPriceFree: boolean;
}

export default function EnrollButton({ courseId, isPriceFree }: EnrollButtonProps) {
    const navigate = useNavigate();

    // Fetch profile state to determine if user is already enrolled
    const { data: user } = useGetProfileQuery();
    const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();

    const isAlreadyEnrolled = user?.enrolledCourses?.some((enrollment: any) => {
        const enrolledId = enrollment.courseId?._id || enrollment._id || enrollment;
        return enrolledId === courseId;
    });

    const handleEnrollment = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const response = await createCheckoutSession({ courseId }).unwrap();

            if (response.mode === "paid" && response.url) {
                // Redirect to Stripe's secure portal interface directly
                window.location.href = response.url;
            } else {
                // Free track unlocks instantly, navigate to classroom dashboard
                navigate(`/courses/${courseId}/lecture`);
            }
        } catch (error: any) {
            alert(error?.data?.message || "Enrollment processing failed. Please try again.");
        }
    };

    if (isAlreadyEnrolled) {
        return (
            <button
                onClick={() => navigate(`/courses/${courseId}/lecture`)}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition shadow-md tracking-wide text-sm"
            >
                Resume Learning Progress →
            </button>
        );
    }

    return (
        <button
            onClick={handleEnrollment}
            disabled={isLoading}
            className={`w-full py-3 text-white font-bold rounded-xl transition shadow-md tracking-wide text-sm flex items-center justify-center gap-2 ${isPriceFree
                    ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                    : "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400"
                }`}
        >
            {isLoading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    Securing Workspace Space...
                </>
            ) : isPriceFree ? (
                "Enroll for Free Now"
            ) : (
                "Buy Premium Course"
            )}
        </button>
    );
}
