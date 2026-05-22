import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";

dotenv.config();

const initialCourses = [
    {
        name: "Full-Stack React & Node.js Masterclass",
        description: "Learn to build scalable production-ready web applications from scratch using the MERN stack. This course covers advanced state management, RESTful API design, and cloud deployments.",
        instructor: "Sarah Jenkins",
        duration: "24 hours total",
        category: "Web Development",
        price: 49.99,
        level: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600",
        tags: ["React", "Node.js", "Express", "MongoDB", "MERN"],
        rating: 4.8,
        lessons: [
            { title: "Course Introduction & Architecture Setup", duration: "12 mins", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", isFreePreview: true },
            { title: "Deep Dive into React Server Components", duration: "25 mins", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", isFreePreview: false },
            { title: "Building a Robust Express Middleware Layer", duration: "30 mins", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", isFreePreview: false }
        ]
    },
    {
        name: "Advanced UI/UX Systems & Micro-Interactions",
        description: "Master advanced layouts, responsive design systems, and delightful motion designs. Designed for experienced developers looking to bridge the gap between frontend engineering and high-fidelity product design.",
        instructor: "Elena Rostova",
        duration: "15 hours total",
        category: "Design",
        price: 29.99,
        level: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=600",
        tags: ["UI/UX", "Tailwind CSS", "Figma", "Framer Motion"],
        rating: 4.9,
        lessons: [
            { title: "The Psychology of Micro-Interactions", duration: "10 mins", videoUrl: "https://example.com/videos/uiux-psychology", isFreePreview: true },
            { title: "Building Dynamic Layouts with CSS Grid & Subgrid", duration: "28 mins", videoUrl: "", isFreePreview: false }
        ]
    },
    {
        name: "Introduction to Python & Data Science",
        description: "The perfect starting point for absolute beginners. Dive into data analytics, understand foundational computer science concepts, and learn how to parse datasets using Pandas and NumPy.",
        instructor: "Dr. Alex Rivera",
        duration: "10 hours total",
        category: "Data Science",
        price: 0,
        level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600",
        tags: ["Python", "Data Science", "Pandas", "Analytics"],
        rating: 4.5,
        lessons: [
            { title: "Setting up Python & Jupyter Notebooks", duration: "15 mins", videoUrl: "https://example.com/videos/python-setup", isFreePreview: true },
            { title: "Variables, Lists, and Control Flow", duration: "22 mins", videoUrl: "", isFreePreview: false },
            { title: "Your First Data Frame with Pandas", duration: "18 mins", videoUrl: "", isFreePreview: false }
        ]
    },
    {
        name: "iOS App Development with Swift & SwiftUI",
        description: "Build high-performance, native iOS applications. Learn the modern declarative syntax of SwiftUI, handle local databases with SwiftData, and manage complex asynchronous networking tasks.",
        instructor: "Marcus Aureli",
        duration: "18 hours total",
        category: "Mobile Apps",
        price: 39.99,
        level: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600",
        tags: ["iOS", "Swift", "SwiftUI", "Mobile Apps"],
        rating: 4.7,
        lessons: [
            { title: "SwiftUI Basics: Stacks, Views, and Modifiers", duration: "14 mins", videoUrl: "https://example.com/videos/swiftui-basics", isFreePreview: true },
            { title: "State Management: @State, @Binding, and Bindable", duration: "26 mins", videoUrl: "", isFreePreview: false }
        ]
    },
    {
        name: "Cybersecurity Fundamentals & Network Defense",
        description: "Protect environments from vulnerabilities. Understand core security frameworks, perform port analysis, detect malware paradigms, and configure system firewalls against standard penetration threats.",
        instructor: "Alan Chen",
        duration: "14 hours total",
        category: "Cybersecurity",
        price: 0,
        level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600",
        tags: ["Security", "Network", "Linux", "Cybersecurity"],
        rating: 4.3,
        lessons: [
            { title: "The CIA Triad & Threat Landscapes", duration: "13 mins", videoUrl: "https://example.com/videos/cia-triad", isFreePreview: true },
            { title: "Basic Linux Commands for Security Professionals", duration: "27 mins", videoUrl: "", isFreePreview: false }
        ]
    },
    {
        name: "Figma Masterclass for Frontend Developers",
        description: "Bridge the gap between design and development. Learn how to navigate Figma, extract assets, construct layout patterns matching CSS Flexbox/Grid, and understand advanced Auto-Layout systems.",
        instructor: "Elena Rostova",
        duration: "8 hours total",
        category: "Design",
        price: 19.99,
        level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600",
        tags: ["Figma", "UI/UX", "Design Systems"],
        rating: 4.4,
        lessons: [
            { title: "Figma Interface Tour & Keyboard Shortcuts", duration: "11 mins", videoUrl: "https://example.com/videos/figma-tour", isFreePreview: true },
            { title: "Demystifying Auto-Layout 5.0", duration: "24 mins", videoUrl: "", isFreePreview: false }
        ]
    },
    {
        name: "Docker & Kubernetes: The Absolute Guide",
        description: "Containerize, scale, and manage applications effortlessly. This course covers image builds, multi-stage building techniques, Docker Compose setups, Kubernetes pods, deployments, and cluster management.",
        instructor: "Devon Miller",
        duration: "16 hours total",
        category: "DevOps",
        price: 0,
        level: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600",
        tags: ["Docker", "Kubernetes", "DevOps", "Cloud"],
        rating: 4.6,
        lessons: [
            { title: "Why Containers Matter & Installing Docker Engine", duration: "15 mins", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", isFreePreview: true },
            { title: "Writing Your First Multi-Stage Dockerfile", duration: "20 mins", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", isFreePreview: false }
        ]
    },
    {
        name: "Next.js 15 Enterprise Architecture",
        description: "Take your React skills to the corporate scale. Master Server Components, Server Actions, partial pre-rendering (PPR), dynamic routing structures, and advanced caching layer configurations.",
        instructor: "Sarah Jenkins",
        duration: "22 hours total",
        category: "Web Development",
        price: 59.99,
        level: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600",
        tags: ["Next.js", "React", "TypeScript", "SSR"],
        rating: 4.9,
        lessons: [
            { title: "Understanding the Next.js App Router Paradigm", duration: "18 mins", videoUrl: "https://example.com/videos/nextjs-router", isFreePreview: true },
            { title: "Optimizing Hydration and Streaming with Suspense", duration: "32 mins", videoUrl: "", isFreePreview: false }
        ]
    },
    {
        name: "Deep Learning with TensorFlow & Keras",
        description: "Construct, train, and optimize deep neural networks. Dive into artificial neural networks (ANNs), convolutional structures (CNNs) for image tracking, and recurrent frameworks (RNNs) for sequential analytics.",
        instructor: "Dr. Alex Rivera",
        duration: "28 hours total",
        category: "Data Science",
        price: 64.99,
        level: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=600&q=80",
        tags: ["TensorFlow", "Deep Learning", "AI", "Python"],
        rating: 4.8,
        lessons: [
            { title: "Mathematical Foundations of Neural Networks", duration: "25 mins", videoUrl: "https://example.com/videos/nn-math", isFreePreview: true },
            { title: "Implementing Backpropagation via Code", duration: "35 mins", videoUrl: "", isFreePreview: false }
        ]
    }
];

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected successfully!");

        // Wipe old data
        console.log("Wiping older course layouts...");
        await Course.deleteMany({});

        // Insert fresh data (Mongoose will now auto-generate the lesson IDs!)
        console.log("Seeding fresh database models...");
        await Course.insertMany(initialCourses);

        console.log("SUCCESS: 9 courses seeded with unique, fixed lesson _ids!");

        // Disconnect cleanly so the terminal process exits
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("FAILED to seed database:", error);
        process.exit(1);
    }
};

seedDatabase();