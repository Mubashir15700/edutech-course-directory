import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const seedAdmin = async () => {
    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("12345@Qw", 10);

        await User.create({
            name: "Admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created");
    } else {
        console.log("Admin already exists");
    }
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        await seedAdmin();

        console.log("Seeding done");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
