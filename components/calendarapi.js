import { useEffect, useState } from "react";
import { ContentPage } from "./content";
import ReactHtmlParser from "react-html-parser";
async function getData() {
  const response = await fetch(
    "https://damp-depths-59602.herokuapp.com/https://v1api-production.up.railway.app/events/"
  );
  const data = response.json();
  console.log("hello");
  console.log(data);
  return data;
}

const Calendar = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getData().then(
      (data) => {
        setIsLoaded(true), setEvents(data);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, []);

  if (error) {
    return (
      <div className="bg-gradient-to-r from-gray-200 to-white">
        {" "}
        Error: {error.message}
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div className="bg-gradient-to-r from-gray-200 to-white">Loading...</div>
    );
  } else if (!events) {
    return (
      <div className="bg-gradient-to-r from-gray-200 to-white">
        No upcoming events.
      </div>
    );
  } else {
    return (
      <ContentPage
        title="Events"
        textElement={
          <div className="mx-auto ">
            {events.map((event) => (
              <div className="text-gray-900 bg-gray-200 p-4 m-4 rounded-md">
                <h2 className="text-xl font-bold">{event.name}</h2>
                <p className="text-sm text-gray-700">
                  {new Date(event.start).toLocaleString()}
                </p>
                {/* <a href="location">Join here</a> */}

                {/* <p>{ReactHtmlParser(event.description)}</p> */}
              </div>
            ))}
          </div>
        }
      />
    );
  }
};

export { Calendar };
//https://stackoverflow.com/questions/7244246/generate-an-rfc-3339-timestamp-similar-to-google-tasks-api
//https://stackoverflow.com/questions/57161839/module-not-found-error-cant-resolve-fs-in
