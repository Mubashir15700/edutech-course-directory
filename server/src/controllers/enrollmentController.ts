import { Request, Response } from "express";
import Stripe from "stripe";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
    throw new Error("CRITICAL CONFIG ERROR: STRIPE_SECRET_KEY is missing.");
}

const stripe = new Stripe(stripeSecret, {
    apiVersion: "2023-10-16" as any,
});

// Dynamically extract the true underlying Event type directly from your stripe client instance
type StripeEvent = Awaited<ReturnType<typeof stripe.webhooks.constructEvent>>;

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    const user = await User.findById(userId);
    const isAlreadyEnrolled = user?.enrolledCourses.some(
        (c: any) => c.courseId.toString() === courseId.toString()
    );

    if (isAlreadyEnrolled) {
        return res.status(400).json({ message: "You are already enrolled in this course." });
    }

    if (course.price === 0) {
        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                enrolledCourses: { courseId: courseId, completedLessons: [] }
            }
        });
        return res.status(201).json({ mode: "free", message: "Enrolled successfully!", courseId });
    }

    // Generate Stripe Checkout Session configuration mapping
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: course.name,
                        description: course.description.substring(0, 150) + "...",
                        images: [course.thumbnail as string],
                    },
                    unit_amount: Math.round(course.price * 100), // Stripe uses cents ($49.99 = 4999)
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
        cancel_url: `${process.env.CLIENT_URL}/courses/${courseId}`,
        metadata: {
            userId: userId.toString(),
            courseId: courseId.toString(),
            amountPaid: course.price.toString()
        },
    });

    res.status(200).json({ mode: "paid", url: session.url });
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"]!;

    let event: StripeEvent;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // Must be the raw body format buffer string
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook Error Verification Failure: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Fullfill access when checkout succeeds
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;

        const userId = session.metadata?.userId;
        const courseId = session.metadata?.courseId;
        const amountPaid = parseFloat(session.metadata?.amountPaid || "0");

        if (userId && courseId) {
            await User.findByIdAndUpdate(userId, {
                $addToSet: {
                    enrolledCourses: { courseId: courseId, completedLessons: [] }
                }
            });

            await Enrollment.findOneAndUpdate(
                { user: userId, course: courseId },
                {
                    status: "completed",
                    paymentId: session.id,
                    amountPaid: amountPaid
                },
                { upsert: true, new: true }
            );
            console.log(`Success access granted: User ${userId} unlocked course ${courseId}`);
        }
    }

    res.status(200).json({ received: true });
};

export const verifySession = async (req: Request, res: Response) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ success: false, message: "Missing session ID" });
    }

    // Look for a matching completed transaction record
    const enrollment = await Enrollment.findOne({ paymentId: sessionId, status: "completed" });

    if (!enrollment) {
        return res.status(404).json({ success: false, message: "Invalid transaction reference" });
    }

    return res.status(200).json({ success: true, enrollment });
};
