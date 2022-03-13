import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import useSupabase from "../hooks/useSupabase";
import NavbarBuilder from "../components/navbar";
export type Data = {
  name: string;
  // later change to rank as an integer
  rank: BigInt;
};

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const [data, setData] = useState<Data | null>(null);
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
          .single();
        if ((dbError && status !== 406) || !dbData) {
          console.log(dbError, dbData);
          router.replace("/404");
        } else if (status !== 200) {
          setDataFetchErrors(["Unexpected status code: " + status]);
        } else {
          setData(dbData);
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
            className={`bg-blue-600 hover:bg-blue-500 items-center text-blue-100 leading-none rounded-full flex inline-flex mb-2 cursor-default`}
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
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center">
                {" "}
                Resources &#8250;
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 
      
        <div className="flex flex-row justify-between w-full font-sans px-4 mt-4">
          <div className="flex flex-col">
            <h3 className="text-3xl font-semibold text-center mb-2">Links</h3>
            <div className="dash-link unlocked">
              Join the{" "}
              <span className="font-semibold">V1 Discord &rsaquo;</span>
            </div>
            <div className="dash-link unlocked">
              Sign Up for the
              <span className="font-semibold"> V1 Newsletter &rsaquo;</span>
            </div>
            <div className="dash-link locked">Member Directory 🔒</div>
            <div className="dash-link locked">Alum Directory 🔒</div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-3xl font-semibold mb-2 text-center">
              Next Steps
            </h3>
            <div className="dash-link unlocked">
              Complete Your
              <span className="font-semibold"> V1 Profile &rsaquo;</span>
            </div>
            <div className="dash-link unlocked">
              Schedule Your
              <span className="font-semibold"> 1:1 Call </span> with a V1 member{" "}
              <span className="font-semibold"> &rsaquo;</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-3xl font-semibold text-center mb-2">Events</h3>
            <div className="dash-link unlocked">
              <p className="font-semibold">April V1 Meetup</p>
              <p>April 1st, 2022 @ 7 pm</p>
              <p className="font-semibold">RSVP &rsaquo;</p>
            </div>
            <div className="dash-link unlocked">
              <p className="font-semibold">
                UMich x Purdue x UIUC Pitch Contest
              </p>
              <p>April 32nd, 2022 @ 2 pm</p>
              <p className="font-semibold">RSVP &rsaquo;</p>
            </div>
            <div className="dash-link unlocked flex flex-row items-center">
              <span>
                Level up to get access to{" "}
                <span className="font-semibold">invite only events</span>
              </span>
              <span className="text-3xl">&rsaquo;</span>
            </div>{" "}
          </div>
        </div>
      </div> */}
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
