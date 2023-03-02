/* eslint-disable react/jsx-no-bind */
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PostgrestMaybeSingleResponse } from "@supabase/supabase-js";
import { Waypoint } from "react-waypoint";
import Head from "../components/Head";
import ProtectedRoute from "../components/ProtectedRoute";
import useSupabase from "../hooks/useSupabase";
import Rank from "../constants/rank";
import NavbarBuilder from "../components/NavBar";
import Step2Prompt from "../components/dashboard/Step2Prompt";
import InternalLink from "../components/Link";
import ConditionalLink from "../components/ConditionalLink";
import CommunityDirectoryIcon from "../public/community_directory.svg";
import EventCard from "../components/dashboard/Events/EventCard";
import { Event } from "../components/dashboard/Events/Event.type";
import ArrowDownIcon from "../public/arrow_down.svg";

// type Event = {
//   name: string;
//   start_date: string;
//   place: string;
//   description: string;
//   link: string;
// };
const EVENT_COLUMNS = "name, start_date, place, description, link, id";

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
  const [events, setEvents] = useState<Event[]>([]);
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  const [eventCount, setEventCount] = useState(5);
  const [showArrow, setShowArrow] = useState(true);
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<Event[]>([]);

  const upcomingEvents = useMemo(
    () => events.filter((e) => new Date(e.start_date) > new Date()),
    [events]
  );

  const pastEvents = useMemo(
    () => events.filter((e) => new Date(e.start_date) < new Date()),
    [events]
  );

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
        // Wait until user's name is fetched in case there's e.g. a 404 error
        const {
          data: dbEvents,
          error: dbEventError,
          status: dbEventStatus,
        } = await supabase
          .from("events")
          .select(EVENT_COLUMNS)
          .range(0, eventCount)
          .order("start_date", { ascending: false });
        if (dbEventError && dbEventStatus !== 406) {
          setDataFetchErrors((errors) => [...errors, dbEventError.message]);
        } else if (!dbEvents) {
          setDataFetchErrors((errors) => [...errors, "No events found"]);
        } else {
          setEvents(dbEvents);
        }
      }
    }
  }, [supabase, user, router, eventCount]);

  function updateEventCount() {
    setEventCount(eventCount + 5);
    fetchData();
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch search data every time a new query is triggered
  useEffect(() => {
    const fetchSearch = async () => {
      const newQuery = query
        .split(" ")
        .map((str) => `'${str}'`)
        .join(" | ");

      const { data } = await supabase
        .from("events")
        .select()
        .or(`name.fts.${newQuery},description.fts.${newQuery}`)
        .order("start_date", { ascending: false });
      // .textSearch("name", newQuery);
      setQueryResults(data ?? []);
    };

    fetchSearch();
  }, [supabase, query]);

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
          {/* TODO: Turn this back on */}
          {/* <div
            className="bg-blue-600 hover:bg-blue-500 items-center text-blue-100 leading-none inline-block rounded-full mb-2 cursor-default"
            role="alert"
          >
            <span className="flex rounded-full tracking-wide uppercase px-1 py-1 text-xs font-bold mr-2 ml-2">
              REGISTERED (R
              {rankLessThan(rank).rank})
            </span>
          </div> */}
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
          <div className="w-full mx-auto mb-2">
            <input
              className="w-full p-2 border border-gray-400 rounded placeholder-gray-400"
              type="text"
              placeholder="Type in an event name, keywords, or a speaker name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <br />

          <div className="md:flex justify-center">
            <div className="flex-1">
              {query ? (
                <>
                  <>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800 my-4 text-center">
                      Results for &quot;{query}&quot; &#8250;
                    </h1>
                    <hr className="mx-auto h-0.5 bg-gray-100 rounded border-0 my-6 dark:bg-gray-300" />
                  </>
                  {queryResults.map((event) => (
                    <EventCard key={event.name} event={event} />
                  ))}
                </>
              ) : (
                <>
                  {upcomingEvents.length > 0 && (
                    <>
                      <h1 className="text-3xl font-bold tracking-tight text-gray-800 my-4 text-center">
                        Upcoming Events &#8250;
                      </h1>
                      <hr className="mx-auto h-0.5 bg-gray-100 rounded border-0 my-6 dark:bg-gray-300" />
                    </>
                  )}
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.name} event={event} />
                  ))}
                  <hr className="mx-auto h-0.5 bg-gray-100 rounded border-0 my-6 dark:bg-gray-300" />
                  <br />
                  <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-4 mt-4 text-center">
                    Previous Events &#8250;
                  </h1>
                  {pastEvents.map((event) => (
                    <EventCard key={event.name} event={event} />
                  ))}
                  <Waypoint
                    onEnter={() => {
                      setTimeout(() => setShowArrow(false), 100);
                      updateEventCount();
                    }}
                    onLeave={() => {
                      setTimeout(() => setShowArrow(true), 100);
                    }}
                  />
                  {showArrow && (
                    <div className="sticky bottom-5 flex justify-center">
                      <ArrowDownIcon className="animate-bounce h-8 w-8 mt-6" />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex-none m-x px-8">
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
