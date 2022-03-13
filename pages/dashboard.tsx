import { NextPage } from "next";

const Dashboard: NextPage = () => (



<main className="font-sans text-black from-white to-black bg-gradient-to-t flex flex-col items-center pt-20"> 
        <h1 className="text-6xl font-sans text-center">Good Evening, <br /> <b>User</b></h1>
        <div className="cursor-pointer text-xl rounded-3xl bg-white px-4 py-1 mt-2 flex flex-row justify-center items-center gap-1">
            <span className="mt-0.5"> Current Rank: 
                <span className="font-semibold"> Apprentice </span>
            </span>
            <span className="text-semibold text-4xl pt-0">&rsaquo;</span>
        </div>
        
        <div className="flex flex-row justify-between w-full font-sans px-4 mt-4">
            {/* Links */}
            <div className="flex flex-col">
                <h3 className="text-3xl font-semibold text-center mb-2">Links</h3>
                <div className="text-xl rounded-3xl bg-white px-4 py-1">Join the <span className="font-semibold">V1 Discord &rsaquo;</span></div>
            </div>
            {/* Next Steps */}
            <div className="flex flex-col text-center">
                <h3 className="text-3xl font-semibold">Next Steps</h3>
            </div>
            {/* Events */}
            <div className="flex flex-col">
                <h3 className="text-3xl font-semibold text-center">Events</h3>
            </div>
        </div>

    </main>
);

export default Dashboard;