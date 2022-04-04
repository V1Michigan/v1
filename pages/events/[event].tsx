import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import SignIn from "../../components/SignIn";
import useSupabase from "../../hooks/useSupabase";

type Event = {
  events: {
    name: string;
    id: string;
    start_date: string;
    end_date: string;
    place: string;
    description: string;
    link: string;
  };
  user_id: string;
};

const ATTENDANCE_COLUMNS = "user_id, events(*)";

const EventPage: NextPage = () => {
  const router = useRouter();
  const eventID = router.query.event as string | undefined;
  const { supabase, user } = useSupabase();
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  const [attendanceData, setAttendanceData] = useState<Event | null>();

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
          data: dbAttendance,
          error: dbAttendanceError,
          status: dbAttendanceStatus,
        } = (await supabase
          .from("attendance")
          .select(ATTENDANCE_COLUMNS)
          .eq("user_id", user.id)
          .single()) as PostgrestSingleResponse<Event>;
        if (dbAttendanceError && dbAttendanceStatus !== 406) {
          setDataFetchErrors((errors) => [
            ...errors,
            dbAttendanceError.message,
          ]);
        } else if (!dbAttendance) {
          setAttendanceData(null);
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
          } else {
            startTimer();
          }
        } else {
          setAttendanceData(dbAttendance);
          startTimer();
        }
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
        {attendanceData && (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center text-white">
              Thanks for attending {attendanceData.events.name}
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
