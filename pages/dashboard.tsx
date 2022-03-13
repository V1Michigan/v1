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
    <main className="font-sans text-black from-white to-black bg-gradient-to-t flex flex-col items-center pt-20">
      <h1 className="text-white text-6xl font-sans text-center mb-4">
        Good Evening, <br /> <b>{data?.name.split(" ")[0]}</b>
      </h1>
      <div className="cursor-pointer text-xl rounded-3xl bg-white px-4 py-1 mt-2 flex flex-row justify-center items-center gap-1">
        <span className="mt-0.5">
          {" "}
          Current Rank:
          {/* add mappings from integer rank to rank names */}
          <span className="font-semibold"> {data?.rank} </span>
        </span>
        <span className="text-semibold text-4xl pt-0">&rsaquo;</span>
      </div>

      <div className="flex flex-row justify-between w-full font-sans px-4 mt-4">
        {/* Links */}
        <div className="flex flex-col">
          <h3 className="text-3xl font-semibold text-center mb-2">Links</h3>
          <div className="dash-link unlocked">
            Join the <span className="font-semibold">V1 Discord &rsaquo;</span>
          </div>
          <div className="dash-link unlocked">
            Sign Up for the
            <span className="font-semibold"> V1 Newsletter &rsaquo;</span>
          </div>
          <div className="dash-link locked">Member Directory 🔒</div>
          <div className="dash-link locked">Alum Directory 🔒</div>
        </div>
        {/* Next Steps */}
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
        {/* Events */}
        <div className="flex flex-col">
          <h3 className="text-3xl font-semibold text-center mb-2">Events</h3>
          <div className="dash-link unlocked">
            <p className="font-semibold">April V1 Meetup</p>
            <p>April 1st, 2022 @ 7 pm</p>
            <p className="font-semibold">RSVP &rsaquo;</p>
          </div>
          <div className="dash-link unlocked">
            <p className="font-semibold">UMich x Purdue x UIUC Pitch Contest</p>
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
    </main>
  );
};
export default () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);
