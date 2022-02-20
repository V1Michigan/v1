import { XIcon } from '@heroicons/react/outline';
import PropTypes from 'prop-types';

const Banner = ({ largeLine, smallLine, link } ) => (
  <div className="bg-yellow-600 full_banner">
    <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between flex-wrap">
        <div className="w-0 flex-1 flex items-center">
          <span className="flex p-2 rounded-lg bg-yellow-800">
            { /* <SpeakerphoneIcon className="h-6 w-6 text-white" aria-hidden="true" /> */ }
            <img className="h-6 w-6" src="/rocket_icon.png" alt="" />
          </span>
          <p className="ml-3 font-medium font-sans text-white truncate">
            <span className="md:hidden">
              {' '}
              { smallLine }
            </span>
            <span className="hidden md:inline">
              {' '}
              { largeLine }
            </span>
          </p>
        </div>
        <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <a
            href={ link }
            target="_blank"
            className="font-sans flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-600 bg-white hover:bg-yellow-50"
            rel="noreferrer"
        >
            Learn more
          </a>
        </div>
        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <button
            type="button"
            className="-mr-1 flex p-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
            onClick={ () => {
              document.querySelector<HTMLElement>('.full_banner').style.display = 'none';
            } }
        >
            <span className="sr-only">Dismiss</span>
            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

Banner.propTypes = {
  largeLine: PropTypes.elementType.isRequired,
  smallLine: PropTypes.elementType.isRequired,
  link: PropTypes.string.isRequired,
};

const ProductStudioBanner = () => (
  <Banner
    largeLine="Product Studio is here! Join us this summer for a sprint to create world-class products that solve real world problems."
    smallLine="Product Studio is Here!"
    link="https://studio.v1michigan.com"
  />
);

const StartupFairBanner = () => (
  <Banner
    largeLine={ (
      <>
        Apply by
        {' '}
        <span className="font-bold">January 22nd</span>
        {' '}
        to meet top
        startups at
        {' '}
        <span className="font-bold">V1 Startup Fair</span>
      </>
    ) }
    smallLine="Meet top startups at V1 Startup Fair!"
    link="https://startupfair.v1michigan.com"
  />
);

export { ProductStudioBanner, StartupFairBanner };
