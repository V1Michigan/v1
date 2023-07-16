import React from "react";
import {
  InformationCircleIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";

interface StartupTileProps {
  logo: string;
  name: string;
  description: string;
  websiteLink: string;
}

export default function StartupTile({
  logo,
  name,
  description,
  websiteLink,
}: StartupTileProps) {
  return (
    <div className="flex flex-col bg-white font-bold leading-none text-gray-800 uppercase rounded-lg shadow-lg duration-100 border border-stone-300">
      <img
        src={logo}
        className="w-1/2 mx-auto mt-6 mb-1 rounded-lg"
        alt="logo"
      />

      <div className="mt-3 mb-2 mx-auto text-center">
        <h1 className="normal-case text-xl font-semibold leading-6 truncate">
          {name}
        </h1>
      </div>

      <p className="mx-4 normal-case text-base font-normal leading-5 tracking-normal text-left mb-3 text-gray-500 truncate text-ellipsis">
        {description}
      </p>

      <div className="flex my-3 mt-auto justify-center items-center">
        <button
          type="button"
          style={{ backgroundColor: "#212936" }}
          className="rounded-lg p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-200 mx-1 "
        >
          <a href={websiteLink} className="flex flex-row m-auto items-center">
            <InformationCircleIcon className=" inline-block h-4 w-4" />
            <p className="inline-block ml-1">See More</p>
          </a>
        </button>

        <button
          type="button"
          className="rounded-lg p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-600 bg-gray-300 mx-1 "
        >
          <a href={websiteLink} className="flex flex-row m-auto items-center">
            <ExternalLinkIcon className=" inline-block h-4 w-4" />
            <p className="inline-block ml-1">Website</p>
          </a>
        </button>
      </div>
    </div>
  );
}
