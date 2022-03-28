import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { PostgrestMaybeSingleResponse } from "@supabase/supabase-js";
import Head from "../components/Head";
import ProtectedRoute from "../components/ProtectedRoute";
import useSupabase from "../hooks/useSupabase";
import { Rank } from "../constants/rank";
import NavbarBuilder from "../components/NavBar";
import CoffeeChatRegister from "../components/dashboard/CoffeeChatRegister";
import Step2Prompt from "../components/dashboard/Step2Prompt";
import OnboardingCohortRegister from "../components/dashboard/OnboardingCohortRegister";
import InternalLink from "../components/Link";

type Event = {
  name: string;
  date: string;
  place: string;
  description: string;
  link: string;
};
const EVENT_COLUMNS = "name, date, place, description, link";

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

const ONBOARDING_PROGRESS = {
  [Rank.RANK_NULL]: 0,
  [Rank.RANK_0]: 10,
  [Rank.RANK_1_ONBOARDING_0]: 20,
  [Rank.RANK_1_ONBOARDING_1]: 20,
  [Rank.RANK_1_ONBOARDING_2]: 25,
  [Rank.RANK_1_ONBOARDING_3]: 25,
  [Rank.RANK_2_ONBOARDING_0]: 50,
  [Rank.RANK_2_ONBOARDING_1]: 60,
  [Rank.RANK_3]: 75,
  [Rank.MEMBER]: 100,
  [Rank.BUILDER]: 100,
  [Rank.LEADERSHIP]: 100,
};

const PROGRESS_SECTIONS = [
  {
    label: "Welcome! 🙂",
    position: ONBOARDING_PROGRESS[Rank.RANK_NULL],
  },
  {
    label: "Complete profile 🖼️",
    position: ONBOARDING_PROGRESS[Rank.RANK_1_ONBOARDING_3],
  },
  {
    label: "Coffee chat ☕️",
    position: ONBOARDING_PROGRESS[Rank.RANK_2_ONBOARDING_0],
  },
  {
    label: "Cohort 🛠️",
    position: ONBOARDING_PROGRESS[Rank.RANK_3],
  },
  {
    label: "V1 Member 🎉",
    position: ONBOARDING_PROGRESS[Rank.MEMBER],
  },
];

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { supabase, user, rank } = useSupabase();
  const [name, setName] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);

  const onboardingProgress = ONBOARDING_PROGRESS[rank || Rank.RANK_NULL];

  useEffect(() => {
    const fetchData = async () => {
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
            .order("date", { ascending: true });
          if (dbEventError && dbEventStatus !== 406) {
            setDataFetchErrors((errors) => [...errors, dbEventError.message]);
          } else if (!dbEvents) {
            setDataFetchErrors((errors) => [...errors, "No events found"]);
          } else {
            // TODO: Filter dates in query
            setEvents(
              (dbEvents as Event[]).filter(
                (event) => new Date(event.date) > new Date()
              )
            );
          }
        }
      }
    };
    fetchData();
  }, [supabase, user, router]);

  // Type guard
  if (!user || rank === undefined) {
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
          <div className="pb-2 pt-1">
            <p className="text-xs font-semibold inline-block uppercase text-blue-800 mb-1">
              Onboarding Progress ({onboardingProgress}%)
            </p>
            <div className="relative h-2 text-xs flex rounded bg-blue-100">
              <div
                style={{
                  width: `${onboardingProgress}%`,
                  transitionProperty: "width",
                  transitionDuration: "1s",
                }}
                // Round edges, but not the right side
                className={`bg-blue-600 rounded-l ${
                  onboardingProgress === 100 ? "rounded-r" : ""
                }`}
              />
              {/* Hide labels on small screens */}
              <div className="absolute w-full hidden md:block">
                {PROGRESS_SECTIONS.map(({ label, position }) => (
                  <div
                    className="absolute whitespace-nowrap"
                    style={{
                      left: `${position}%`,
                      transform: `translateX(-${
                        [0, 100].includes(position) ? position : 50
                      }%)`,
                    }}
                    key={position}
                  >
                    {/* Section divider (same color as background) */}
                    <div
                      className={`w-2 h-3 mx-auto bg-gray-100 ${
                        [0, 100].includes(position) ? "invisible" : ""
                      }`}
                    />
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-screen-xl mx-auto py-6 px-4">
          {dataFetchErrors.map((error) => (
            <p key={error} className="text-red-500">
              {error}
            </p>
          ))}
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 mb-4 text-center">
            What&apos;s next &#8250;
          </h1>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <CoffeeChatRegister />
            <Step2Prompt />
            <OnboardingCohortRegister />
          </div>
          <div className="md:flex justify-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center">
                Upcoming Events &#8250;
              </h1>
              {events.map((event) => (
                <div
                  className="bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center"
                  key={event.name + event.date}
                >
                  <h6 className="font-bold text-lg">{event.name}</h6>
                  <p className="">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </p>
                  <p className="italic mb-2">{event.place}</p>
                  <p className="mb-2">{event.description}</p>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      type="button"
                      className="text-center text-sm block text-gray-100 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-500 shadow py-2 px-3 rounded mx-auto hover:opacity-75"
                    >
                      RSVP &rsaquo;
                    </button>
                  </a>
                </div>
              ))}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center">
                Resources &#8250;
              </h1>
              <InternalLink href="/community">
                <p className="block bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg hover:bg-gray-200 hover:opacity-75 transition-all cursor-pointer">
                  <img
                    className="mb-1 inline-block w-8 mr-1 my-auto"
                    src="/discord-gray-icon.webp"
                    alt="Discord icon"
                  />
                  Join the{" "}
                  <span className="font-semibold">V1 Discord &rsaquo;</span>
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
              <div className="block bg-gray-300 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg hover:cursor-not-allowed">
                <span className="text-2xl">🔒 </span>
                Member Directory
              </div>
              <div className="block bg-gray-300 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg hover:cursor-not-allowed">
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
