import { useEffect, useState } from "react";
import { ContentPage } from "./content"
import ReactHtmlParser from 'react-html-parser';
async function getData() {
  const response = await fetch('https://damp-depths-59602.herokuapp.com/https://v1api-production.up.railway.app/events/')
  const data = response.json();
  console.log("hello");
  console.log(data);
  return data;
}

const Calendar = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [events, setEvents] = useState([]);

 useEffect(()=> {
   getData().then(data => {
     setIsLoaded(true),
     setEvents(data)
   }, error => {
    setIsLoaded(true);
    setError(error);
   })
 }, []);

 if(error) {
   return <div className="bg-gradient-to-r from-gray-200 to-white"> Error: {error.message}</div>
 } else if (!isLoaded) {
    return <div className="bg-gradient-to-r from-gray-200 to-white">Loading...</div>
 } else {
    return (
      <ContentPage title="Events" 
        textElement={
          <div className="mx-auto max-w-2xl">
          <ul className="text-2xl text-gray-900"> 
            { events.map(event => (
              <li key={event.id}>
              <details>
                <summary className="font-bold"> {event.name} </summary>
                <p>{ReactHtmlParser(event.description)}</p>
                <p>Date: {event.start}</p>
              </details>
        
              
            </li>

            ))}
          </ul>
          </div>
          }
      />
  
    );
 }
  
}

export { Calendar }
//https://stackoverflow.com/questions/7244246/generate-an-rfc-3339-timestamp-similar-to-google-tasks-api
//https://stackoverflow.com/questions/57161839/module-not-found-error-cant-resolve-fs-in
