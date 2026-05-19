interface VideoPlayerProps {
    courseId: string;
    lessonId: string;
    videoUrl: string;
}

import { useCompleteLessonMutation } from "../features/users/usersApi";

export default function VideoPlayer({ courseId, lessonId, videoUrl }: VideoPlayerProps) {
    const [completeLesson] = useCompleteLessonMutation();

    const handleVideoFinished = () => {
        // Automatically updates their profile progress bars without needing a click
        completeLesson({ courseId, lessonId });
    };

    return (
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
            <video
                src={videoUrl}
                controls
                className="w-full h-full"
                // Native React HTML5 video event hook listener:
                onEnded={handleVideoFinished}
            />
        </div>
    );
}
