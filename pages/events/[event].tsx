import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { PostgrestSingleResponse, PostgrestMaybeSingleResponse } from "@supabase/supabase-js";
import SignIn from "../../components/SignIn";
import useSupabase from "../../hooks/useSupabase";
import InternalLink from "../../components/Link";

type Event = {
  name: string;
  id: string;
  start_date: string;
  end_date: string;
  place: string;
  description: string;
  link: string;
};

enum DateStatus {
  past = "past",
  present = "present",
  future = "future",
  loading = "loading",
}

const addMinutes = (date: Date, minutes: number) => {
  // add minutes to date
  return new Date(date.getTime() + minutes * 60000);
};

const ATTENDANCE_COLUMNS = "user_id";
const EVENT_COLUMNS = "*";

const EventPage: NextPage = () => {
  const router = useRouter();
  const eventID = router.query.event as string | undefined;
  const { supabase, user } = useSupabase();
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  const [eventData, setEventData] = useState<Event | null>();
  const [dateStatus, setDateStatus] = useState<DateStatus>(DateStatus.loading);
  const [presentEventCountdown, presentEventsetCountdown] = useState(10);

  const startTimer = useCallback(() => {
    const interval = setInterval(() => {
      presentEventsetCountdown((currentCountdown) => {
        if (currentCountdown <= 0) {
          clearInterval(interval);
          router.push("/dashboard");
          return 0;
        }
        return currentCountdown - 1;
      });
    }, 1000);
  }, [router]);

  useEffect(() => {
    const recordAttendance = async () => {
      // Extract whether eventID exists within the database
      if (user) {
        const {
          data: dbEvent,
          error: dbEventError,
          status: dbEventStatus,
        } = (await supabase
          .from("events")
          .select(EVENT_COLUMNS)
          .eq("id", eventID)
          .single()) as PostgrestSingleResponse<Event>;
        if ((dbEventError && dbEventStatus !== 406) || !dbEvent) {
          setDataFetchErrors((errors) => [...errors, "Error: invalid event ID"]);
        } else {
          setEventData(dbEvent);
          // if start_date minus 30 minutes is in the future, set dateStatus to future
          // if end_date plus 90 minutes is in the past, set dateStatus to past
          // else set dateStatus to present
          const startDate = new Date(dbEvent.start_date);
          const endDate = new Date(dbEvent.end_date);
          const now = new Date();
          if (now < addMinutes(startDate, 30)) {
            setDateStatus(DateStatus.future);
          } else if (now > addMinutes(endDate, 90)) {
            setDateStatus(DateStatus.past);
          } else {
            setDateStatus(DateStatus.present);
            const {
              data: dbAttendance,
              error: dbAttendanceError,
              status: dbAttendanceStatus,
            } = (await supabase
              .from("attendance")
              .select(ATTENDANCE_COLUMNS)
              .eq("event_id", eventID)
              .eq("user_id", user.id)
              .maybeSingle()) as PostgrestMaybeSingleResponse<{ user_id: string }>;
            if (dbAttendanceError && dbAttendanceStatus !== 406) {
              setDataFetchErrors((errors) => [...errors, dbAttendanceError.message]);
            } else if (!dbAttendance) {
              const { error: dbCreateAttendanceError, status: dbCreateAttendanceStatus } =
                await supabase.from("attendance").insert(
                  {
                    event_id: eventID,
                    user_id: user.id,
                  },
                  { returning: "minimal" }
                );
              if (
                dbCreateAttendanceError &&
                dbCreateAttendanceStatus !== 406 &&
                // Can't reliably reproduce this, but consensus is that it's a weird
                // Supabase bug. Row still gets inserted correctly, so probably fine
                !dbCreateAttendanceError.message.includes(
                  "duplicate key value violates unique constraint"
                )
              ) {
                setDataFetchErrors((errors) => [...errors, dbCreateAttendanceError.message]);
              } else {
                startTimer();
              }
            } else {
              startTimer();
            }
          }
        }
      }
    };
    recordAttendance();
  }, [user, eventID, supabase, startTimer]);

  if (!user) {
    return (
      <SignIn
        isLoginPage
        // This redirect won't work on localhost (can't add dynamic URLs to
        // Supabase's allow-list), but does work in prod
        redirect={
          eventID ? `${process.env.NEXT_PUBLIC_HOSTNAME || ""}/events/${eventID}` : undefined
        }
      />
    );
  }
  let startDateStr = "",
    endDateStr = "";
  let startDate = new Date();
  if (eventData) {
    startDate = new Date(eventData.start_date);
    startDateStr = startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    endDateStr = new Date(eventData.end_date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  }
  if (dateStatus === DateStatus.loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-gradient h-screen flex flex-col items-center justify-center p-4">
      <div className="md:flex-1 text-white text-center">
        {eventData && (
          <>
            <h1 className="text-2xl font-bold tracking-tight mb-4 mt-8 text-white">
              {dateStatus === DateStatus.present
                ? `Thanks for attending ${eventData.name}`
                : dateStatus === DateStatus.future
                ? `Get hyped for ${eventData.name}`
                : `${eventData.name} has ended, come to the next events 🚀`}
            </h1>
            {dateStatus === DateStatus.present ||
              (dateStatus === DateStatus.future && (
                <h2 className="text-xl font-bold mb-4 mt-8">
                  {startDateStr} - {endDateStr}
                </h2>
              ))}
            <p className="text-left mx-64">
              {dateStatus === DateStatus.present
                ? `You're all checked in! ✅ Redirecting to your dashboard...`
                : eventData.description}
            </p>
            {dateStatus === DateStatus.present && (
              <div
                style={{
                  width: `${presentEventCountdown * 10}%`,
                  transitionProperty: "width",
                  transitionDuration: "1s",
                  transitionTimingFunction: "linear",
                }}
                // Round edges, but not the right side
                className={`my-4 h-2 bg-blue-600 rounded-l ${
                  presentEventCountdown * 10 === 100 ? "rounded-r" : ""
                }`}
              />
            )}
          </>
        )}
        {dataFetchErrors.map((error) => (
          <p key={error} className="text-red-500">
            {error}
          </p>
        ))}
        <div>{dateStatus === DateStatus.future}</div>
        {/* link back to dashboard route */}
        <InternalLink href="/dashboard">
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              {dateStatus === DateStatus.future ? "Go to Dashboard" : "Go Back"}
            </button>
          </div>
        </InternalLink>
      </div>
    </div>
  );
};

export default EventPage;
