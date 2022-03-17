import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type {
  PostgrestMaybeSingleResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import useSupabase from "../hooks/useSupabase";
import NavbarBuilder from "../components/NavBar";
import OnboardingCohortRegister from "../components/OnboardingCohortRegister";
import Step2Prompt from "../components/Step2Prompt";

type Data = {
  name: string;
  rank: BigInt;
};

type Event = {
  name: string;
  date: Date;
  place: string;
  description: string;
  link: string;
};
const EVENT_COLUMNS = "name, date, place, description, link";

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { supabase, user, rank } = useSupabase();
  const [data, setData] = useState<Data | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [onboardingStatus, setOnboardingStatus] = useState<
    number | null | undefined
  >(undefined);
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);

  let onboardingProgress = 0;
  if (rank === 0) {
    onboardingProgress = 10;
  } else if (rank === 1) {
    onboardingProgress = 20;
  }
  if (onboardingStatus !== null) {
    onboardingProgress += 10;
  }

  useEffect(() => {
    const fetchData = async () => {
      setDataFetchErrors([]);
      if (user) {
        const {
          data: dbData,
          error: dbError,
          status,
        } = (await supabase
          .from("profiles")
          .select("name, rank")
          .eq("id", user.id)
          .single()) as PostgrestSingleResponse<Data>;
        if ((dbError && status !== 406) || !dbData) {
          router.replace("/404");
        } else if (status !== 200) {
          setDataFetchErrors((errors) => [
            ...errors,
            `Unexpected status code: ${status}`,
          ]);
        } else {
          setData(dbData);
          await Promise.all([
            (async () => {
              const {
                data: dbEvents,
                error: dbEventError,
                status: dbEventStatus,
              } = await supabase
                .from("events")
                .select(EVENT_COLUMNS)
                .order("date", { ascending: true });
              if ((dbEventError && dbEventStatus !== 406) || !dbEvents) {
                setDataFetchErrors((errors) => [
                  ...errors,
                  dbEventError.message,
                ]);
              } else {
                setEvents(dbEvents);
              }
            })(),
            (async () => {
              const { data: onboardingData, error: onboardingError } =
                (await supabase
                  .from("onboarding")
                  .select("status")
                  .eq("user_id", user.id)
                  .maybeSingle()) as PostgrestMaybeSingleResponse<{
                  status: number;
                }>;
              if (onboardingError) {
                setDataFetchErrors((errors) => [
                  ...errors,
                  onboardingError.message,
                ]);
              }
              setOnboardingStatus(onboardingData?.status ?? null);
            })(),
          ]);
        }
      }
    };
    fetchData();
  }, [supabase, user, router]);

  // Type guard
  if (!user) {
    return null;
  }

  const handleCohortRegister = async () => {
    const { error: upsertError } = await supabase.from("onboarding").upsert({
      user_id: user.id,
      status: 0,
      created_at: new Date(),
    });
    if (upsertError) {
      setDataFetchErrors((errors) => [...errors, upsertError.message]);
    }
    setOnboardingStatus(0);
  };

  return (
    <>
      <NavbarBuilder />
      <div className="bg-gray-100">
        <div className="max-w-screen-xl mx-auto py-6 px-4">
          <div
            className="bg-blue-600 hover:bg-blue-500 items-center text-blue-100 leading-none inline-block rounded-full mb-2 cursor-default"
            role="alert"
          >
            <span className="flex rounded-full tracking-wide uppercase px-1 py-1 text-xs font-bold mr-2 ml-2">
              REGISTERED (R
              {data?.rank})
            </span>
          </div>

          <h1 className="text-xl tracking-tight text-gray-900">
            Welcome,{" "}
            <span className="font-bold text-gray-900">
              {" "}
              {data?.name.split(" ")[0]}
            </span>
            .
          </h1>
          <div className="pb-2 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block uppercase text-blue-800 mb-1">
                  Onboarding Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-800 ml-4">
                  {onboardingProgress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
              <div
                style={{ width: `${onboardingProgress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
              />
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
            {onboardingStatus !== undefined && (
              <OnboardingCohortRegister
                submitted={onboardingStatus !== null}
                handleSubmit={handleCohortRegister}
              />
            )}
            <Step2Prompt />
          </div>
          <div className="md:flex justify-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center">
                Upcoming Events &#8250;
              </h1>
              {events.map((event) => (
                <div
                  className="bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center"
                  key={event.name}
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
                  <button
                    type="button"
                    className="text-center text-sm block text-gray-100 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-500 shadow py-2 px-3 rounded mx-auto hover:opacity-75"
                  >
                    RSVP &rsaquo;
                  </button>
                </div>
              ))}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center">
                Resources &#8250;
              </h1>
              <Link href="/community" passHref>
                <p className="block bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg hover:bg-gray-200 hover:opacity-75 transition-all cursor-pointer">
                  <img
                    className="mb-1 inline-block w-8 mr-1 my-auto"
                    src="/discord-gray-icon.webp"
                    alt="Discord icon"
                  />
                  Join the{" "}
                  <span className="font-semibold">V1 Discord &rsaquo;</span>
                </p>
              </Link>
              <a
                className="block bg-gray-100 max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center text-lg hover:bg-gray-200 hover:opacity-75 transition-all"
                href="https://v1network.substack.com/"
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

export default () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);
