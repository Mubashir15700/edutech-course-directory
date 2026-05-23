import type { IUser } from "../../features/users/types";

interface AccountSettingsProps {
    message: { type: "success" | "error"; text: string } | null;
    user: IUser;
    handleSaveProfile: (e: React.FormEvent<HTMLFormElement>) => void;
    newName: string;
    setNewName: React.Dispatch<React.SetStateAction<string>>;
}

const AccountSettings = ({ message, user, handleSaveProfile, newName, setNewName }: AccountSettingsProps) => {
    return (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm max-w-xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">Account Configurations</h3>
            <p className="text-xs text-gray-400 mb-6">Modify details related to your student workspace credentials.</p>

            {/* Interactive Response Banner Alerts */}
            {message && (
                <div className={`p-4 mb-4 rounded-xl text-xs font-semibold ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                    {message.text}
                </div>
            )}

            <form className="space-y-4" onSubmit={e => handleSaveProfile(e)}>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Profile Name</label>
                    <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-700"
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Contact Address</label>
                    <input type="email" value={user.email} disabled className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-400 cursor-not-allowed" />
                </div>
                <div className="pt-2 flex justify-end">
                    <button
                        disabled={!newName || newName === user.name}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-blue-700 transition shadow-sm"
                    >
                        Save System Profile
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AccountSettings