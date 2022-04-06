import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  PostgrestSingleResponse,
  PostgrestMaybeSingleResponse,
} from "@supabase/supabase-js";
import SignIn from "../../components/SignIn";
import useSupabase from "../../hooks/useSupabase";

type Event = {
  name: string;
  id: string;
  start_date: string;
  end_date: string;
  place: string;
  description: string;
  link: string;
};

const ATTENDANCE_COLUMNS = "user_id";
const EVENT_COLUMNS = "*";

const EventPage: NextPage = () => {
  const router = useRouter();
  const eventID = router.query.event as string | undefined;
  const { supabase, user } = useSupabase();
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  const [eventData, setEventData] = useState<Event | null>();
  // const [attendanceData, setAttendanceData] = useState<string | null>();

  const [countdown, setCountdown] = useState(10);

  const startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setCountdown((currentCountdown) => {
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
        if (dbEventError && dbEventStatus !== 406) {
          setDataFetchErrors((errors) => [...errors, dbEventError.message]);
        } else if (!dbEvent) {
          // ERROR event DOES NOT EXIST
        } else {
          setEventData(dbEvent);
        }
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
          setDataFetchErrors((errors) => [
            ...errors,
            dbAttendanceError.message,
          ]);
        } else if (!dbAttendance) {
          const {
            data: dbCreateAttendance,
            error: dbCreateAttendanceError,
            status: dbCreateAttendanceStatus,
          } = await supabase
            .from("attendance")
            .insert([
              {
                event_id: eventID,
                user_id: user.id,
              },
            ])
            .eq("user_id", user.id);
          if (dbCreateAttendanceError && dbCreateAttendanceStatus !== 406) {
            setDataFetchErrors((errors) => [
              ...errors,
              dbCreateAttendanceError.message,
            ]);
          } else if (!dbCreateAttendance) {
            setDataFetchErrors((errors) => [...errors, "No events found"]);
          }
        }
        startTimer();
      }
    };
    recordAttendance();
  }, [user, eventID, supabase, startTimer]);

  if (!user) {
    return (
      <SignIn
        isLoginPage
        redirect={eventID ? `/events/${eventID}` : undefined}
      />
    );
  }

  return (
    <div className="bg-gradient h-screen flex flex-col items-center justify-center p-4">
      <div className="flex-1 text-white">
        {eventData && (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center text-white">
              Thanks for attending {eventData.name}
            </h1>
            <p>You&apos;re all checked in! Redirecting to your Dashboard...</p>
            <div
              style={{
                width: `${countdown * 10}%`,
                transitionProperty: "width",
                transitionDuration: "1s",
              }}
              // Round edges, but not the right side
              className={`m-4 h-2 bg-blue-600 rounded-l ${
                countdown * 10 === 100 ? "rounded-r" : ""
              }`}
            />
            {dataFetchErrors.map((error) => (
              <p key={error} className="text-red-500">
                {error}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default EventPage;
