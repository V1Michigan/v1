import React, { useState } from "react";
import { Event } from "./Event.type";
import InternalLink from "../../Link";

const EventCard = ({ event }: { event: Event }) => {
  const date = new Date(event.start_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const dateAbbreviations = {
    september: "Sept",
    october: "Oct",
    november: "Nov",
    december: "Dec",
    january: "Jan",
    february: "Feb",
    march: "Mar",
    april: "Apr",
    may: "May",
    june: "June",
    july: "July",
    august: "Aug",
  };
  const abbreviatedDesc =
    event.description?.length > 300
      ? event.description.substring(0, 300) + " ..."
      : event.description;
  return (
    <div className="flex items-center justify-center sm:mx-4 md:mx-6 lg:mx-8 mb-8 hover:shadow-2xl hover:scale-105 hover:ease-in duration-100">
      <div className="flex flex-col w-full bg-gray-100 rounded shadow-lg">
        <div className="flex flex-col w-full lg:flex-row">
          <InternalLink
            href={`/events/${event.id}`}
            className="flex flex-row justify-around p-4 font-bold leading-none text-gray-800 uppercase bg-gray-400 rounded lg:flex-col lg:items-center lg:justify-center lg:w-1/4">
            <div className="md:text-xl lg:text-2xl">
              {
                dateAbbreviations[
                  date.split(" ")[0].toLowerCase() as keyof typeof dateAbbreviations
                ]
              }
            </div>
            <div className="md:text-xl lg:text-5xl">{date.split(" ")[1].split(",")[0]}</div>
            <div className="md:text-xl lg:text-xl text-center">{`${date.split(" ")[4]} ${
              date.split(" ")[5]
            }`}</div>
          </InternalLink>
          <InternalLink
            href={`/events/${event.id}`}
            className="p-4 font-normal text-gray-800 lg:w-3/4">
            <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-800">
              {event.name}
            </h1>
            <p className="leading-normal text-sm">{abbreviatedDesc}</p>
            <div className="flex flex-row items-center mt-1 text-gray-700 font-bold">
              {event.place}
            </div>
          </InternalLink>
          <div className="flex flex-row lg:pb-0 pb-4 justify-around font-bold leading-none text-gray-800 uppercase rounded lg:flex-col lg:items-center lg:justify-center lg:w-1/4">
            <button
              type="button"
              className="text-center text-sm block text-gray-100 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-500 shadow py-2 px-3 rounded mx-auto hover:opacity-75">
              RSVP &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
