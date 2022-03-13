import { NextPage } from "next";

const Dashboard: NextPage = () => (



<main className="font-sans text-black from-white to-black bg-gradient-to-t flex flex-col items-center pt-20"> 
        <h1 className="text-6xl font-sans text-center">Good Evening, <br /> <b>User</b></h1>
        <div className="text-xl rounded-3xl bg-white px-4 pt-2 mt-2">
            <span className="inline-block pb-6">Current Rank: 
                <span className="font-semibold">Apprentice </span>
            </span>
            <span className="inline-block text-semibold text-4xl mb-0">&rsaquo;</span>
        </div>
        <div className="flex flex-row justify-between w-full font-sans px-4 mt-4">
            <div className="flex flex-col">
                <h3 className="text-3xl font-semibold text-center">Links</h3>
            </div>
            <div className="flex flex-col text-center">
                <h3 className="text-3xl font-semibold">Next Steps</h3>
            </div>
            <div className="flex flex-col">
                <h3 className="text-3xl font-semibold text-center">Events</h3>
            </div>
        </div>

    </main>
);

export default Dashboard;