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
    <div className="flex flex-col bg-white font-bold p-6 leading-none text-gray-800 uppercase rounded-lg shadow-lg duration-100 border border-stone-300">
      <img src={logo} className="w-1/2 mx-auto rounded-lg" alt="logo" />

      <div className="mt-6 mx-auto text-center">
        <h1 className="normal-case text-xl font-semibold leading-6 truncate">
          {name}
        </h1>
      </div>

      <p
        style={{ height: "60px", overflow: "hidden", textOverflow: "ellipsis" }}
        className="normal-case text-base font-normal leading-5 tracking-normal text-left mt-3 text-gray-500"
      >
        {description}
      </p>

      <div className="flex mt-4 justify-between items-center">
        <button
          type="button"
          style={{
            backgroundColor: "#212936",
            width: "calc(50% - 6px)",
          }}
          className="rounded-lg p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-200 flex justify-center"
        >
          <a href={websiteLink} className="flex flex-row m-auto items-center gap-1">
            <InformationCircleIcon className=" inline-block h-5 w-5" />
            <p className="inline-block">See More</p>
          </a>
        </button>

        <button
          type="button"
          style={{ width: "calc(50% - 6px)", }}
          className="rounded-lg p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-600 bg-gray-300 flex justify-center"
        >
          <a href={websiteLink} className="flex flex-row m-auto items-center gap-1">
            <ExternalLinkIcon className=" inline-block h-5 w-5" />
            <p className="inline-block">Website</p>
          </a>
        </button>
      </div>
    </div >
  );
}
