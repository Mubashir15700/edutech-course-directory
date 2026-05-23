export interface LessonInput {
    title: string;
    duration: string;
    videoUrl?: string;
    isFreePreview: boolean;
}

export interface CourseFormState {
    _id?: string;
    name: string;
    description: string;
    instructor: string;
    duration: string;
    category: string;
    price: number;
    level: "Beginner" | "Intermediate" | "Advanced";
    thumbnail: string;
    tags: string[];
    rating: number;
    lessons: LessonInput[];
}
