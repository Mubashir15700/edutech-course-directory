import type { CourseFormState, LessonInput } from "../../../types/course";

export const initialFormState: CourseFormState = {
    name: "",
    description: "",
    instructor: "",
    duration: "",
    category: "",
    price: 0,
    level: "Beginner",
    thumbnail: "",
    tags: [],
    rating: 0,
    lessons: [],
};

export const createInitialFormState = (data?: Partial<CourseFormState>): CourseFormState => {
    if (!data) return initialFormState;

    return {
        name: data.name ?? initialFormState.name,
        description: data.description ?? initialFormState.description,
        instructor: data.instructor ?? initialFormState.instructor,
        duration: data.duration ?? initialFormState.duration,
        category: data.category ?? initialFormState.category,
        price: data.price ?? initialFormState.price,
        level: data.level ?? initialFormState.level,
        thumbnail: data.thumbnail ?? initialFormState.thumbnail,
        tags: data.tags ?? initialFormState.tags,
        rating: data.rating ?? initialFormState.rating,
        lessons: data.lessons ?? initialFormState.lessons,
    };
};

export const emptyLesson: LessonInput = {
    title: "",
    duration: "",
    videoUrl: "",
    isFreePreview: false,
};
