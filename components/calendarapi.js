import { useEffect, useState } from "react";
import { ContentPage } from "./content";
import ReactHtmlParser from "react-html-parser";
async function getData() {
  const response = await fetch(
    "https://damp-depths-59602.herokuapp.com/https://v1api-production.up.railway.app/events/"
  );
  const data = response.json();

  return data;
}

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getData().then((data) => {
      setEvents(data);
    });
  }, []);

  return (
    <>
      {events && events.length > 0 && (
        <ContentPage
          title="Upcoming Events"
          textElement={
            <div className="mx-auto">
              {events.map((event) => (
                <div className="w-full text-gray-900 bg-gray-200 p-4 m-4 rounded-md">
                  <h2 className="text-xl font-bold">{event.name}</h2>
                  <p className="text-sm text-gray-700">
                    {new Date(event.start).toLocaleString()}
                  </p>
                  <p>{ReactHtmlParser(event.description)}</p>
                </div>
              ))}
            </div>
          }
        />
      )}
    </>
  );
};

export { Calendar };
//https://stackoverflow.com/questions/7244246/generate-an-rfc-3339-timestamp-similar-to-google-tasks-api
//https://stackoverflow.com/questions/57161839/module-not-found-error-cant-resolve-fs-in
