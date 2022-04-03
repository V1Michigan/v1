import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import useSupabase from "../../hooks/useSupabase";
import { Rank } from "../../constants/rank";

// type Event = {
//   events: {
//     name: string;
//     id: string;
//     start_date: string;
//     end_date: string;
//     place: string;
//     description: string;
//     link: string;
//   };
//   user_id: string;
// };

const ATTENDANCE_COLUMNS = "user_id, events(*)";

const EventPage: NextPage = () => {
  const router = useRouter();
  const eventID = router.query.event;
  const { supabase, user } = useSupabase();
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  useEffect(() => {
    const recordAttendance = async () => {
      // Extract whether eventID exists within the database
      // Wait until user's name is fetched in case there's e.g. a 404 error
      // TODO figure out how to get dbEvents as one event (the event that we are looking for)
      if (user) {
        const {
          data: dbAttendance,
          error: dbAttendanceError,
          status: dbAttendanceStatus,
        } = await supabase
          .from("attendance")
          .select(ATTENDANCE_COLUMNS)
          .eq("user_id", user.id);
        if (dbAttendanceError && dbAttendanceStatus !== 406) {
          setDataFetchErrors((errors) => [
            ...errors,
            dbAttendanceError.message,
          ]);
        } else if (!dbAttendance) {
          setDataFetchErrors((errors) => [...errors, "No events found"]);
        } else if (dbAttendance.length !== 1) {
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
            console.log("just marked attendance!");
          }
        } else {
          console.log("already marked attendance");
        }
      }
    };
    recordAttendance();
  }, [user, eventID, supabase]);

  return (
    <></>
    // <div className="md:flex justify-center">
    //   <div className="flex-1">
    //     <h1 className="text-2xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center">
    //       Thanks for Attending
    //     </h1>
    //     {attendance.map((event) => (
    //       <div
    //         className="max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center"
    //         key={event.name + event.start_date}
    //       >
    //         <h6 className="font-bold text-lg"> {event.name} </h6>
    //         <p>Your attendance has been marked!</p>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
};

const ProtectedProfile = () => (
  <ProtectedRoute minRank={Rank.RANK_0}>
    <EventPage />
  </ProtectedRoute>
);

export default ProtectedProfile;
