import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import useSupabase from "../../hooks/useSupabase";
import { Rank } from "../../constants/rank";
import type {
  PostgrestError,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

type Event = {
  name: string;
  start_date: string;
  place: string;
  description: string;
  link: string;
};

const EVENT_COLUMNS = "name, start_date, place, description, link";

const EventPage: NextPage = () => {
  const router = useRouter();
  const eventID = router.query.event;
  const { supabase, username: currentUsername } = useSupabase();
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  const [uid, setUserID] = useState<string>("bruh");
  const [events, setEvents] = useState<Event[]>([]);
  const [attendance, setAttendance] = useState<string>("dubbruh");

  useEffect(() => {
    const fetchEventData = async () => {
      // Extract whether eventID exists within the database
      // Wait until user's name is fetched in case there's e.g. a 404 error
      // TODO figure out how to get dbEvents as one event (the event that we are looking for)
      const {
        data: dbEvents,
        error: dbEventError,
        status: dbEventStatus,
      } = await supabase.from("events").select(EVENT_COLUMNS).eq("id", eventID);
      if (dbEventError && dbEventStatus !== 406) {
        setDataFetchErrors((errors) => [...errors, dbEventError.message]);
      } else if (!dbEvents) {
        setDataFetchErrors((errors) => [...errors, "No events found"]);
      } else {
        setEvents(dbEvents as Event[]);
      }
    };

    const getUserID = async () => {
      const {
        data: userID,
        error: dbUserIDError,
        status: dbUserIDStatus,
      } = (await supabase
        .from("profiles")
        .select("id")
        .eq("username", currentUsername)
        .single()) as PostgrestSingleResponse<string>;
      if (dbUserIDError && dbUserIDStatus !== 406) {
        setDataFetchErrors((errors) => [...errors, dbUserIDError.message]);
      } else if (!userID) {
        setDataFetchErrors((errors) => [...errors, "No events found"]);
      } else {
        setUserID(userID.id);
      }
    };

    const recordAttendance = async () => {
      // Extract whether eventID exists within the database
      // Wait until user's name is fetched in case there's e.g. a 404 error
      // TODO figure out how to get dbEvents as one event (the event that we are looking for)
      const {
        data: hasRecordAttendance,
        error: dbRecordAttendanceError,
        status: dbRecordAttendanceStatus,
      } = (await supabase
        .from("attendance")
        .select("user_id")
        .eq("user_id", uid)
        .eq("event_id", eventID)
        .single()) as PostgrestSingleResponse<string>;
      if (dbRecordAttendanceError && dbRecordAttendanceStatus !== 406) {
        console.log(dbRecordAttendanceError);
        setDataFetchErrors((errors) => [
          ...errors,
          dbRecordAttendanceError.message,
        ]);
      } else if (!hasRecordAttendance) {
        setDataFetchErrors((errors) => [...errors, "No events found"]);
      } else {
        console.log(hasRecordAttendance);
      }
    };
    // TODO set / update the db in the attendance table as recorded -> either create or update
    // Get uid
    // if (!done) {
    getUserID();
    
    console.log(uid);
    fetchEventData();
    recordAttendance();
    // TODO recordAttendance();
  }, [uid, currentUsername, eventID, supabase]);

  return (
    <div className="md:flex justify-center">
      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 mb-4 mt-8 text-center">
          Thanks for Attending
        </h1>
        {events.map((event) => (
          <div
            className="max-w-xs rounded-md p-4 mx-auto text-gray-800 mb-2 tracking-tight text-center"
            key={event.name + event.start_date}
          >
            <h6 className="font-bold text-lg"> {event.name} </h6>
            <p>Your attendance has been marked!</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProtectedProfile = () => (
  <ProtectedRoute minRank={Rank.RANK_0}>
    <EventPage />
  </ProtectedRoute>
);

export default ProtectedProfile;
