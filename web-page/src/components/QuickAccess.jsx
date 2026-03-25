import Link from "next/link"; // IMPORT NEXT.JS LINK

// Added 'href' paths to each item
const accessItems = [
    { name: "ANNOUNCEMENTS", icon: "🔔", href: "/announcements" },
    { name: "SCHEDULE", icon: "📅", href: "/schedule" },
    { name: "FINANCES", icon: "💰", href: "/finances" },
    { name: "MY MODULES", icon: "📖", href: "/modules" }, // Points to our new page!
];

export default function QuickAccess() {
    return (
        <div className="w-full p-6 border-2 border-gray-900 rounded-lg bg-white">
            <div className="flex items-center mb-6 pb-2 border-b-2 border-gray-900">
                <span className="text-xl mr-2">⚡</span>
                <h2 className="text-xl font-extrabold uppercase text-gray-900">QUICK ACCESS</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {accessItems.map((item) => (
                    /* CHANGED: button is now a Link wrapper */
                    <Link href={item.href} key={item.name} className="block">
                        <button className="w-full h-20 bg-simconnect-button rounded-lg p-5 flex items-center justify-between shadow-md group hover:scale-[1.03] transition-all cursor-pointer">
                            <span className="text-md font-bold uppercase text-gray-950 tracking-wide">{item.name}</span>
                            <span className="text-3xl">{item.icon}</span>
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}