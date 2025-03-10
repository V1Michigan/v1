/* eslint-disable react/jsx-no-bind */
import type { PostgrestMaybeSingleResponse } from "@supabase/supabase-js";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import ConditionalLink from "../components/ConditionalLink";
import Step2Prompt from "../components/dashboard/Step2Prompt";
import Head from "../components/Head";
import InternalLink from "../components/Link";
import NavbarBuilder from "../components/NavBar";
import ProtectedRoute from "../components/ProtectedRoute";
import Rank from "../constants/rank";
import useSupabase from "../hooks/useSupabase";
import CommunityDirectoryIcon from "../public/community_directory.svg";

const Welcome = ({ name }: { name: string | null }) => {
  const firstName = name?.split(" ")[0] || name;
  const hrs = new Date().getHours();
  let greeting;
  if (hrs < 12) greeting = "Good morning";
  else if (hrs >= 12 && hrs <= 17) greeting = "Good afternoon";
  else if (hrs >= 17 && hrs <= 24) greeting = "Good evening";
  return (
    <h1 className="text-xl tracking-tight text-gray-900">
      {greeting}
      {firstName ? (
        <>
          , <span className="font-bold"> {firstName}</span>.
        </>
      ) : (
        "!"
      )}
    </h1>
  );
};

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { supabase, user, rank } = useSupabase();
  const [name, setName] = useState<string | null>(null);
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setDataFetchErrors([]);

    if (user) {
      const {
        data,
        error: dbError,
        status,
      } = (await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .maybeSingle()) as PostgrestMaybeSingleResponse<{ name: string }>;

      if ((dbError && status !== 406) || !data) {
        router.replace("/404");
      } else if (status !== 200) {
        setDataFetchErrors((errors) => [
          ...errors,
          `Unexpected status code: ${status}`,
        ]);
      } else {
        setName(data?.name);
      }
    }
  }, [supabase, user, router]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Type guard
  if (!user || rank === null) {
    return null;
  }

  return (
    <>
      <Head title="Dashboard" />
      <NavbarBuilder />
      <div className="bg-gray-100">
        <div className="max-w-screen-xl mx-auto py-6 px-4">
          <Welcome name={name} />
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-screen-xl mx-auto py-6 px-4">
          {dataFetchErrors.map((error) => (
            <p key={error} className="text-red-500">
              {error}
            </p>
          ))}

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Step2Prompt />
          </div>

          <div className="md:flex justify-center">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-800 my-4 text-center">
                Events &#8250;
              </h1>
              <hr className="mx-auto h-0.5 bg-gray-100 rounded border-0 my-6 dark:bg-gray-300" />

              <div className="flex justify-center my-6">
                <iframe
                  src="https://lu.ma/embed/calendar/cal-5RVNjOj9vOYAaIE/events?lt=light"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  style={{
                    border: "1px solid #bfcbda88",
                    borderRadius: "8px",
                    maxWidth: "800px",
                  }}
                  allowFullScreen
                  aria-hidden="false"
                  title="V1 Events Calendar"
                />
              </div>
            </div>

            <div className="flex-none m-x pl-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-800 my-4 text-center">
                Resources &#8250;
              </h1>
              <hr className="mx-auto h-0.5 bg-gray-100 rounded border-0 my-6 dark:bg-gray-300" />
              <InternalLink href="/community" target="_blank">
                <p className="block bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg hover:bg-gray-200 hover:opacity-75 transition-all cursor-pointer">
                  <img
                    className="mb-1 inline-block w-6 mr-1.5 my-auto"
                    src="/slack-logo.webp"
                    alt="Slack icon"
                  />
                  Join the{" "}
                  <span className="font-semibold">V1 Slack &rsaquo;</span>
                </p>
              </InternalLink>
              <a
                className="block bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg hover:bg-gray-200 hover:opacity-75 transition-all"
                href="https://v1network.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="mb-1 inline-block w-8 mr-1 my-auto"
                  src="/substackicon.webp"
                  alt="Substack icon"
                />
                Read the{" "}
                <span className="font-semibold">V1 Newsletter &rsaquo;</span>
              </a>
              <ConditionalLink
                href={rank < Rank.INACTIVE_MEMBER ? undefined : "/members"}
              >
                <p
                  className={`block max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg ${
                    rank < Rank.INACTIVE_MEMBER
                      ? "bg-gray-300 hover:cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 hover:opacity-75 transition-all"
                  }`}
                >
                  {rank < Rank.INACTIVE_MEMBER ? (
                    <span className="text-2xl">🔒 </span>
                  ) : (
                    <CommunityDirectoryIcon className="mb-1 inline-block w-8 mr-1 my-auto" />
                  )}
                  Community Directory
                </p>
              </ConditionalLink>
              <div className="block max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg bg-gray-300 hover:cursor-not-allowed">
                <span className="text-2xl">🔒 </span>
                Alumni Directory
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProtectedDashboard = () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

export default ProtectedDashboard;
