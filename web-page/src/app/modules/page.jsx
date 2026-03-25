import Sidebar from "@/components/Sidebar";
import studentData from "@/data/studentInfo.json"; // 1. IMPORT THE JSON DATA

export default function ModulesPage() {
    // 2. Extract the modules array from the JSON file
    const modules = studentData.modules;

    // 3. Automatically calculate the stats!
    const totalModules = modules.length;
    const totalCredits = modules.reduce((sum, mod) => sum + mod.credits, 0);
    const averageCredits = (totalCredits / totalModules).toFixed(1);

    return (
        <div className="flex min-h-screen bg-simconnect-bg relative">
            <Sidebar />

            <main className="flex-1 p-8 md:p-12 h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 pb-4 border-b-2 border-gray-900">
                    <div>
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl">📚</span>
                            <h1 className="text-3xl font-extrabold uppercase text-gray-900">
                                MY MODULES
                            </h1>
                        </div>
                        <p className="text-sm font-bold text-gray-600 mt-2 uppercase tracking-wider">Your enrolled courses for this semester</p>
                    </div>
                </div>

                {/* Top Stats Cards (Now driven by math instead of hardcoded numbers) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white border-2 border-gray-900 rounded-lg p-6 flex flex-col shadow-sm">
                        <div className="flex justify-between items-center text-gray-800 text-xs font-bold uppercase mb-4">
                            <span>Total Modules</span>
                            <span className="text-lg">📖</span>
                        </div>
                        <span className="text-4xl font-extrabold text-gray-900 mb-1">{totalModules}</span>
                        <span className="text-xs font-medium text-gray-500 uppercase">Active this semester</span>
                    </div>
                    <div className="bg-white border-2 border-gray-900 rounded-lg p-6 flex flex-col shadow-sm">
                        <div className="flex justify-between items-center text-gray-800 text-xs font-bold uppercase mb-4">
                            <span>Total Credits</span>
                            <span className="text-lg">🎖️</span>
                        </div>
                        <span className="text-4xl font-extrabold text-gray-900 mb-1">{totalCredits}</span>
                        <span className="text-xs font-medium text-gray-500 uppercase">Credit hours</span>
                    </div>
                    <div className="bg-white border-2 border-gray-900 rounded-lg p-6 flex flex-col shadow-sm">
                        <div className="flex justify-between items-center text-gray-800 text-xs font-bold uppercase mb-4">
                            <span>Average Credits</span>
                            <span className="text-lg">⏱️</span>
                        </div>
                        <span className="text-4xl font-extrabold text-gray-900 mb-1">{averageCredits}</span>
                        <span className="text-xs font-medium text-gray-500 uppercase">Per module</span>
                    </div>
                </div>

                {/* Module Grid (Loops through the JSON data) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
                    {modules.map((mod, index) => (
                        <div key={index} className="bg-white border-2 border-gray-900 rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow">
                            
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-wide mb-1">{mod.code}</h3>
                                    <p className="text-gray-700 text-sm font-bold uppercase">{mod.title}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${mod.theme}`}>
                                    {mod.code.split("-")[1].substring(0, 1)}
                                </div>
                            </div>

                            <div className="bg-simconnect-bg border-2 border-gray-200 rounded-lg p-4 flex items-center mb-6">
                                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-900 text-gray-900 flex items-center justify-center mr-4 font-bold">
                                    👤
                                </div>
                                <div>
                                    <p className="text-sm font-extrabold text-gray-900">{mod.lecturer}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase mt-0.5">Lecturer</p>
                                </div>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center text-gray-900 text-sm font-bold">
                                    <span className="mr-2">🎖️</span> {mod.credits} CREDITS
                                </div>
                                <div className="flex space-x-3">
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}