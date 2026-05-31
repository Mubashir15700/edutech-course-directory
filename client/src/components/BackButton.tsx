import { Link } from 'react-router-dom'

interface BackButtonProps {
    text?: string;
    goTo?: string;
}

const BackButton = ({ goTo, text = "Back to Course Directory" }: BackButtonProps) => {
    return (
        <div className="max-w-6xl mx-auto px-4 mb-6 sm:px-6 lg:px-8">
            <Link to={goTo || "/courses"} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2">
                ← {text}
            </Link>
        </div>
    )
}

export default BackButton