import { XIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { useState } from "react";

interface BannerProps {
  link: string;
  largeLine: JSX.Element | string;
  smallLine: JSX.Element | string;
  buttonText: string;
}

const Banner = ({ largeLine, smallLine, link, buttonText }: BannerProps) => {
  const [open, setOpen] = useState(true);
  if (!open) {
    return null;
  }
  return (
    <div className="bg-yellow-600">
      <div className="mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-yellow-800">
              {/* <SpeakerphoneIcon className="h-6 w-6 text-white" aria-hidden="true" /> */}
              <img className="h-6 w-6" src="/rocket_icon.png" alt="" />
            </span>
            {/* TODO: This largeLine/smallLine stuff is confusing, I thought it was a subtitle at first */}
            <p className="ml-3 font-medium font-sans text-white">
              <span className="hidden md:inline"> {largeLine}</span>
              <span className="md:hidden"> {smallLine}</span>
            </p>
          </div>
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
    </div>
  );
};

Banner.propTypes = {
  largeLine: PropTypes.element || PropTypes.string,
  smallLine: PropTypes.element || PropTypes.string,
  link: PropTypes.element || PropTypes.string,
};

Banner.defaultProps = {
  largeLine: "",
  smallLine: "",
  link: "",
};

const ProductStudioBanner = () => (
  <Banner
    largeLine="Product Studio is here! Join us this summer for a sprint to create world-class products that solve real world problems."
    smallLine="Product Studio is Here!"
    link="https://studio.v1michigan.com"
    buttonText="Learn more &rsaquo;"
  />
);

const StartupFairBanner = () => (
  <Banner
    largeLine={
      <>
        Apply by <span className="font-bold">January 22nd</span> to meet top
        startups at <span className="font-bold">V1 Startup Fair</span>
      </>
    }
    smallLine="Meet top startups at V1 Startup Fair!"
    link="https://startupfair.v1michigan.com"
    buttonText="Sign up &rsaquo;"
  />
);

export { Banner as default, ProductStudioBanner, StartupFairBanner };
