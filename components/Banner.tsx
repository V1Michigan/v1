import { XIcon } from "@heroicons/react/outline";
import { useState } from "react";

interface BannerProps {
  link: string;
  text: JSX.Element | string;
  buttonText: string;
}

const Banner = ({ text, link, buttonText }: BannerProps) => {
  const [open, setOpen] = useState(true);
  if (!open) {
    return null;
  }
  return (
    <div className="bg-yellow-600 p-3">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center">
          <span className="flex p-2 rounded-lg bg-yellow-800">
            {/* <SpeakerphoneIcon className="h-6 w-6 text-white" aria-hidden="true" /> */}
            <img className="h-6 w-6" src="/rocket_icon.png" alt="" />
          </span>
        </div>
        <p className="p-3 flex-1 flex-grow font-medium font-sans text-white">
          {text}
        </p>
        <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <a
            href={link}
            className="font-sans flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-600 bg-white hover:bg-yellow-200 transition duration-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {buttonText}
          </a>
        </div>
        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <button
            type="button"
            className="-mr-1 flex p-2 rounded-md hover:bg-yellow-500 transition duration-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Dismiss</span>
            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductStudioBanner = () => (
  <Banner
    text="Product Studio is here! Join us this summer for a sprint to create world-class products that solve real world problems."
    link="https://studio.v1michigan.com"
    buttonText="Learn more &rsaquo;"
  />
);

const CohortsApplyBanner = () => (
  <Banner
    text={
      <>
        Apply by <span className="font-bold">January 25th</span> to a be a part
        of our <span className="font-bold">W23 Cohort</span>
      </>
    }
    link="/apply"
    buttonText="Apply now &rsaquo;"
  />
);

const StartupFairBanner = () => (
  <Banner
    text={
      <>
        Apply by <span className="font-bold">October 21st</span> to meet top
        startups at <span className="font-bold">V1 Startup Fair</span>
      </>
    }
    link="https://startupfair.v1michigan.com"
    buttonText="Apply now &rsaquo;"
  />
);

export {
  Banner as default,
  ProductStudioBanner,
  CohortsApplyBanner,
  StartupFairBanner,
};
