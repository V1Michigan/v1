import React from "react";
import {
  InformationCircleIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";

interface StartupTileProps {
  Logo: string;
  Name: string;
  Description: string;
  WebsiteLink: string;
}

/* BEFORE YOU PROCEED TO USE THIS COMPONENT, PLEASE PASTE THE FOLLOWING CODE INTO A WEBPAGE TAB TO UNDERSTAND HOW THE STARTUP TILE COMPONENT IS GOING TO BE USED.
if you directly use the startup component it's going to be pretty ugly. The component is designed to dynamically fit into properly sized and formatted flex containers like the one below.

<ContentPage
        title="Startups"
        textElement={
          <div>
            <div className="bg-black font-bold p-10 leading-none my-4 text-white uppercase bg-gray-400 rounded text-center">
              Startup Directory Header Goes Here
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <StartupTile
                Logo="/startups/ramp.png"
                Name="Company Name Super Long  Yadaa Yada Yada"
                Description="Company description. It’s truncated if it exceeds three lines of length just like this one does blah blah"
                WebsiteLink="https://ramp.com/"
              />
              <StartupTile
                Logo="/startups/ramp.png"
                Name="Ramp"
                Description="Credit Card Company"
                WebsiteLink="https://ramp.com/"
              />
              <StartupTile
                Logo="/startups/ramp.png"
                Name="Super Long Company Name Yadaa Yada Yada"
                Description="Credit Card Company"
                WebsiteLink="https://ramp.com/"
              />
              <StartupTile
                Logo="/startups/ramp.png"
                Name="Super Long Company Name Yadaa Yada Yada"
                Description="Credit Card Company"
                WebsiteLink="https://ramp.com/"
              />
            </div>
          </div>
        }
      />
      
*/

export default function StartupTile({
  Logo,

  Name,
  Description,
  WebsiteLink,
}: StartupTileProps) {
  const maxDescriptionLength = 75; // feel free to change this as needed. Figma directions only mention truncating after 3 "lines".
  const abbreviatedDesc =
    Description?.length > maxDescriptionLength
      ? `${Description.substring(0, maxDescriptionLength)} ...`
      : Description;

  return (
    <div className="flex flex-col bg-white font-bold leading-none text-gray-800 uppercase  rounded ">
      <img src={Logo} className="w-1/2 mx-auto mt-6 mb-1 rounded" alt="Logo" />

      <div className="mx-4 mt-3 mb-2 mx-auto text-center ">
        <h1 className="font-inter normal-case text-xl font-semibold leading-6 truncate">
          {Name}
        </h1>
      </div>

      <p className="mx-4 font-inter normal-case text-base font-normal leading-5 tracking-normal text-left overflow-hidden line-clamp-3 mb-3 text-gray-500">
        {abbreviatedDesc}
      </p>

      <div className="flex my-3 mt-auto justify-center items-center">
        <button
          type="button"
          style={{ backgroundColor: "#212936" }}
          className="rounded p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-200 mx-1 "
        >
          <a href={WebsiteLink} className="flex flex-row m-auto items-center">
            <InformationCircleIcon className=" inline-block h-4 w-4" />
            <p className="inline-block ml-1">See More</p>
          </a>
        </button>

        <button
          type="button"
          className="rounded p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-600 bg-gray-300 mx-1 "
        >
          <a href={WebsiteLink} className="flex flex-row m-auto items-center">
            <ExternalLinkIcon className=" inline-block h-4 w-4" />
            <p className="inline-block ml-1">Website</p>
          </a>
        </button>
      </div>
    </div>
  );
}
