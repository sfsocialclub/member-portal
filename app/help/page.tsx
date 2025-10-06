import Link from "next/link";

export default function HelpPage() {
    return (
        <div className="flex flex-col items-center h-full w-full max-w-sm">
            <div className="flex flex-col mb-20 w-full">
                <h1 className="text-xl font-semibold">Help</h1>
            </div>
            <div className="flex flex-col gap-4 w-full justify-center items-center">
                <Link href="/help/add-app-to-home-screen" className="card max-w-96 w-full bg-base-100 card-md shadow-sm hover:bg-gray-100 cursor-pointer transition-all">
                    <div className="card-body">
                        <h2 className="card-title">Add to Home screen</h2>
                    </div>
                </Link>
                <Link href="/help/guide" className="card max-w-96 w-full bg-base-100 card-md shadow-sm hover:bg-gray-100 cursor-pointer transition-all">
                    <div className="card-body">
                        <h2 className="card-title">Take a Quick Tour</h2>
                    </div>
                </Link>
            </div>
        </div>
    );
}
