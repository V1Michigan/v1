import { useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { ContentPage } from "./content";

async function getData() {
  const response = await fetch(
    "https://damp-depths-59602.herokuapp.com/https://v1api-production.up.railway.app/events/"
  );
  return response.json();
}

interface Event {
  name: string;
  start: string; // start and end are timestamps
  end: string;
  description: string;
}

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getData().then((data) => {
      setEvents(data as Event[]);
    });
  }, []);

  if (!(events && events.length > 0)) {
    return null;
  }

  return (
    <ContentPage
      title="Upcoming Events"
      textElement={
        <div>
          {events.map((event) => (
            <div
              className="text-gray-900 bg-gray-200 p-4 mb-2 shadow-md rounded-md overflow-hidden"
              key={event.name + event.start}
            >
              <h2 className="text-xl font-bold">{event.name}</h2>
              <p className="text-sm text-gray-700">
                {/* https://stackoverflow.com/questions/7244246/generate-an-rfc-3339-timestamp-similar-to-google-tasks-api */}
                {new Date(event.start).toLocaleString()}
              </p>
              {/* Consider just using dangerouslySetInnerHtml here,
                  I think react-html-parser breaks some of our deps anyway */}
              {ReactHtmlParser(event.description)}
            </div>
          ))}
        </div>
      }
    />
  );
};

export default Calendar;
