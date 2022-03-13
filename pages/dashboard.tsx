import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import useSupabase from "../hooks/useSupabase";
import NavbarBuilder from "../components/navbar";
import { route } from "next/dist/server/router";

export type Data = {
  name: string;
  // later change to rank as an integer
  rank: BigInt;
};

export type Event = {
  name: string;
  date: Date;
  location: string;
  description: string;
  link: string
}

const EVENT_COLUMNS = `name, date, place, description, link`;

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const [data, setData] = useState<Data | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setDataFetchErrors([]);
      if (user) {
        const {
          data: dbData,
          error: dbError,
          status,
        } = await supabase
          .from("profiles")
          .select("name, rank")
          .eq("id", user.id)
          .single()
        if ((dbError && status !== 406) || !dbData) { 
          router.replace("/404");
        } else if (status !== 200) {
          setDataFetchErrors(["Unexpected status code: " + status]);
        } else {
          setData(dbData);
          const { data: dbEvents, error: dbEventError, status: dbEventStatus } = await supabase.from("events").select(EVENT_COLUMNS);
          
          if ((dbEventError && dbEventStatus !== 406) || !dbEvents) {
            router.replace("/404");
          }
          else if (dbEventStatus !== 200) {
            setDataFetchErrors(["Unexpected status code: " + dbEventStatus]);
          }
          else {
            setEvents(dbEvents);
          }
        }
      }
    };
    fetchData();
  }, [supabase, user, router]);

  

  return (
    <>
      <NavbarBuilder />
      <div className="bg-gray-100">
        <div className="max-w-screen-xl mx-auto py-6 px-4">
          <div
            className={`bg-blue-600 hover:bg-blue-500 items-center text-blue-100 leading-none rounded-full flex mb-2 cursor-default`}
            role="alert"
          >
            <span className="flex rounded-full tracking-wide uppercase px-1 py-1 text-xs font-bold mr-2 ml-2">
              REGISTERED (R{data?.rank})
            </span>
          </div>

          <h1 className="text-3xl tracking-tight text-gray-900">
            Welcome,{" "}
            <span className={`font-bold text-gray-900`}>
              {" "}
              {data?.name.split(" ")[0]}
            </span>
            .
          </h1>
          <div className="pb-2 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span
                  className={`text-xs font-semibold inline-block uppercase text-blue-800 mb-1`}
                >
                  Onboarding Progress
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs font-semibold inline-block text-blue-800 ml-4`}
                >
                  10%
                </span>
              </div>
            </div>
            <div
              className={`overflow-hidden h-2 text-xs flex rounded bg-blue-100`}
            >
              <div
                style={{ width: 10 + "%" }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-screen-xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-4 text-center">
            {" "}
            What's next &#8250;
          </h1>

          <div className="flex justify-center">
            <div className="bg-gray-100 max-w-sm rounded-md p-4">
              <h1 className="font-bold tracking-tight text-xl text-gray-900 mb-2">
                Join a V1 Onboarding Cohort.
              </h1>
              <h2 className="text-gray-800">
                V1 provides the most driven students with an extraordinary
                network, exclusive opportunities within startups, and mentorship
                to grow and achieve great things, together. Start the process to
                become an official V1 member today.{" "}
              </h2>

              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-500 text-gray-100 font-semibold py-3 px-4 rounded shadow mt-3 hover:opacity-75">
                I'm interested &#8250;
              </button>

              {/* This should post to the onboarding table. THe button should be disabled after click and say "Great. ✅	We'll reach out to you via email soon." */}
            </div>
          </div>
          <div className="md:flex justify-center">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center">
                {" "}
                Upcoming Events &#8250;
              </h1>
              {/* <div className="bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center">
                <h6 className="font-bold text-lg">April V1 Meetup</h6>
                <p className="">April 1st, 2022 @ 7 pm </p>
                <p className="italic mb-2">ROSS Impact Studio</p>
                <p className="mb-2">Think of the most epic description to place here. We're going to be doing some insane things. This is just the beginning. </p>
                <button className="text-center text-sm block text-gray-100 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-500 shadow py-2 px-3 rounded mx-auto hover:opacity-75">RSVP &rsaquo;</button>
              </div> */}
              {events.map((event) => {
                return (
                  <div className="bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center">
                    <h6 className="font-bold text-lg">{event.name}</h6>
                    <p className="">{event.date}</p>
                    <p className="italic mb-2">{event.location}</p>
                    <p className="mb-2">{event.description}</p>
                    <button className="text-center text-sm block text-gray-100 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-500 shadow py-2 px-3 rounded mx-auto hover:opacity-75">RSVP &rsaquo;</button>
                  </div>
                );
              })}

          </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center">
                {" "}
                Resources &#8250;
              </h1>
              <a className="block bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg hover:bg-gray-200 hover:opacity-75 transition-all" href="/community">
                <img className="mb-1 inline-block w-8 mr-1 my-auto" src="/discord-gray-icon.webp" alt="discord icon" />
                Join the <span className="font-semibold">V1 Discord &rsaquo;</span>
              </a>
              <a className="block bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg hover:bg-gray-200 hover:opacity-75 transition-all" href="/newsletter">
                <img className="mb-1 inline-block w-8 mr-1 my-auto" src="/substackicon.webp" alt="discord icon" />
                Read the <span className="font-semibold">V1 Newsletter &rsaquo;</span>
              </a>
              <div className="block bg-gray-300 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg">
                <span className="text-2xl">🔒 </span>Member Directory
              </div>
              <div className="block bg-gray-300 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg">
                <span className="text-2xl">🔒 </span>Alumni Directory
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

// Todo:
// Replace Welcome with "Good morning", "Good afternoon", "Good evening".
// Ranks -- replace "Registered" with correct rank names
// After Onboarding progress, there's a new progress bar for "member progress"
