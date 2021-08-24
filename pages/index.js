import Head from "next/head";
import { What, Offer, Join, Leadership, Advisors } from "../components/about";
import NavbarBuilder from "../components/navbar.js"
import { ProductStudioBanner } from "../components/banner";
import { Calendar } from '../components/calendarapi'

export default function IndexPage() {
  return (
    <main>
      <Head>
        <title>V1 | University of Michigan</title>
        <link rel="icon" href="/favicon.ico?v=1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="description"
          content="V1 is a monthly newsletter for ambitious engineering and design
          students at the University of Michigan who are looking to build something great."
        />
        <meta name="og:title" content="V1 | University of Michigan" />
        <meta
          name="og:description"
          content="V1 is a monthly newsletter for ambitious engineering and design
          students at the University of Michigan who are looking to build something great."
        />
        <meta property="og:image" content="/share.png" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      {/* <ProductStudioBanner /> */}
      <NavbarBuilder />
      <div className="h-screen flex justify-center items-center bg-gradient-to-r from-gray-200 to-white">
        <div className="max-w-screen-xl">
          { /* <Link href="https://studio.v1michigan.com" target="_blank">
            <div className="block lg:text-center mb-8">
              <div
                className="p-2 bg-gradient-to-r from-yellow-200 to-yellow-500 items-center text-gray-800 hover:opacity-75 leading-none rounded-full flex inline-flex mb-2 cursor-pointer"
                role="alert"
              >
                <span className="flex rounded-full bg-yellow-500 uppercase px-2 py-1 text-xs font-bold mr-2 ml-2">
                  New
                </span>
                <span className="font-semibold mr-1 text-left flex-auto text-sm">
                  Product Studio
                </span>
                <svg
                  className="fill-current opacity-75 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                </svg>
              </div>
            </div>
  </Link> */}
          <div className="md:flex">
            <div className="flex-1 p-8 flex items-center">
              <div className="">
                <h1 className="text-6xl tracking-tight font-bold font-logo text-gray-900 leading-none">
                  V1
                </h1>
                <h2 className="text-2xl tracking-tight font-bold italic text-gradient bg-gradient-to-r from-yellow-600 to-yellow-700">
                  at Michigan
                </h2>
                <p className="text-2xl mt-8 text-gray-900 font-bold tracking-tight mb-3">
                  The community for ambitious student builders at the University
                  of Michigan.
                </p>
              </div>
            </div>
            <div className="max-w-xl p-4">
              <img className="tilt shadow-md rounded-sm" src="/gif.gif"></img>
            </div>
          </div>
        </div>
      </div>

      <What />
      <Offer />
      <Calendar />
      <Join />
      {/* <Leadership />
      <Advisors /> */}
      <div className="bg-gradient-to-r from-gray-900 to-black">
        <p className="footer text-gray-200 text-center py-8">
          &copy; 2021 V1 | team@v1michigan.com
        </p>
      </div>
    </main>
  );
}
