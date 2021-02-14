import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function YC() {
  const [event, setEvent] = useState({
    name: "",
    email: "",
    referral: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [referrer, setReferrer] = useState(null);

  const partners = [
    "mproduct",
    "shift",
    "upround",
    "cfe",
    "blockchain",
    "akpsi",
    "wolverinesintech",
    "geecs",
    "sepi",
    "mpowered",
    "startum",
  ];

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const referral = urlParams.get("ref");
    if (referral) {
      setReferrer(referral);
      setEvent({ ...event, referral: referral });
    }
  }, []);

  const autoExpand = (target) => {
    target.style.height = "inherit";
    target.style.height = target.scrollHeight + "px";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });

    autoExpand(e.target);
  };
  return (
    <main>
      <Head>
        <title>V1 x Y Combinator | University of Michigan</title>
        <link rel="icon" href="/favicon.ico?v=1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="description"
          content="V1 and Y Combinator present a fireside chat event with YC President Geoff Ralston"
        />
        <meta name="og:title" content="V1 Community | University of Michigan" />
        <meta
          name="og:description"
          content="V1 and Y Combinator present a fireside chat event with YC President Geoff Ralston"
        />
        <meta property="og:image" content="/yc-event.jpg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="bg-gradient-to-r from-gray-900 to-black p-4">
        <div className="p-4 flex justify-center md:justify-start">
          <Link href="/">
            <img className="logo mr-3 rounded-sm" src="/apple-touch-icon.png" />
          </Link>
          <div className="text-white text-xl flex items-center font-bold">
            x
          </div>
          <img className="logo ml-3 rounded-sm" src="/yc.png" />
          {referrer && (
            <>
              <div className="text-white text-xl flex items-center font-bold ml-3">
                {partners.includes(referrer.toLowerCase()) ? (
                  <>
                    x{" "}
                    <img
                      className="logo ml-3 p-1 bg-gray-100 rounded-sm"
                      src={`/partners/${referrer.toLowerCase()}.png`}
                    />
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
        <div>
          <div className="block text-center mt-4">
            <div
              className="p-2 bg-gradient-to-r from-yellow-200 to-yellow-500 items-center text-gray-800 hover:opacity-75 leading-none rounded-full flex inline-flex mb-2 cursor-pointer"
              role="alert"
            >
              <span className="flex rounded-full bg-yellow-500 uppercase px-2 py-1 text-xs font-bold mr-2 ml-2">
                New
              </span>
              <span className="font-semibold mr-1 text-left flex-auto text-sm">
                Y Combinator Event
              </span>
            </div>
          </div>
          <h1 className="text-4xl text-center tracking-tight text-gray-100 p-4 max-w-2xl mx-auto font-bold">
            Fireside chat with YC President Geoff Ralston & Partner Reshma
            Khilnani
          </h1>
          <p className="text-center font-bold text-gray-200 text-2xl">
            Wednesday, February 17th at 7 PM ET
          </p>
          <div className="max-w-lg mx-auto p-4 text-base">
            {" "}
            <p className="text-gray-200">
              V1 is hosting an event with Y Combinator, the seed startup
              accelerator that funded Stripe, Airbnb, Cruise Automation,
              DoorDash, Coinbase, Instacart, Dropbox, Twitch, Reddit, & more.
            </p>
            <p className="text-gray-200 mt-2">
              Join us for a talk with Y Combinator President Geoff Ralston and
              Partner Reshma Khilnani. Geoff & Reshma will cover some of the
              myths that exist around starting startups, what you should do
              while you’re still in school if you want to start a company, and
              how YC can help you get started. Q&A to follow.
            </p>
            <p className="text-gray-200 mt-2">
              This event is open to all Michigan students. Register as soon as
              possible.
            </p>
          </div>
        </div>
        <form
          className="max-w-xl mx-auto p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            const data = new FormData();
            for (const [key, value] of Object.entries(event)) {
              data.append(key, value);
            }

            axios
              .post(
                "https://script.google.com/macros/s/AKfycbxlhVld1NPhOCvEPqctFEoRqSV7QCSXngL72BcJeb5CUUbEbrdm3xAu/exec",
                data
              )
              .then((res) => {
                if (res.data.result === "success") {
                  window.location.href =
                    "https://ycombinator.zoom.us/meeting/register/tJMvfu2vqz0sE9V4tnmbHYztXxeGNhP438lG?timezone_id=America%2FNew_York";
                } else {
                  Swal.fire(
                    "There was an error submitting the form.",
                    "Please try again later or contact us at team@v1michigan.com",
                    "error"
                  );
                }
              })
              .finally(() => {
                setSubmitted(false);
                setEvent({
                  name: "",
                  email: "",
                  referral: "",
                });
              });
          }}
        >
          <div>
            <div className="w-full bg-gray-100 shadow-md rounded p-4">
              <div className="px-3 my-4">
                <label
                  className="block text-gray-800 text-lg mb-2"
                  htmlFor="name"
                >
                  Full Name <span className="text-red-800">*</span>
                  <input
                    name="name"
                    id="name"
                    className="mt-2 appearance-none block w-full bg-gray-900 text-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-800"
                    type="text"
                    placeholder="Billy Magic"
                    onChange={handleInputChange}
                    value={event.name}
                    required
                    disabled={submitted}
                  />
                </label>
              </div>
              <div className="px-3 my-4">
                <label
                  className="block text-gray-800 text-lg mb-2"
                  htmlFor="email"
                >
                  Email <span className="text-red-800">*</span>
                  <input
                    name="email"
                    id="email"
                    className="mt-2 appearance-none block w-full bg-gray-900 text-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-800"
                    type="text"
                    placeholder="Email"
                    onChange={handleInputChange}
                    value={event.email}
                    required
                    disabled={submitted}
                  />
                </label>
              </div>
              <div className="px-3 my-4">
                <label className="block text-gray-800 text-lg mb-2">
                  How did you hear about this event?{" "}
                  <span className="text-red-800">*</span>
                  <input
                    name="referral"
                    id="referral"
                    className="mt-2 appearance-none block w-full bg-gray-900 text-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-800"
                    type="text"
                    placeholder="V1 Newsletter, etc."
                    onChange={handleInputChange}
                    value={event.referral}
                    required
                    disabled={submitted}
                  />
                </label>
              </div>
              <div className="px-3 mt-10 mb-6">
                <button
                  type="submit"
                  className={`bg-gradient-to-r from-yellow-200 to-yellow-500 hover:opacity-75 text-gray-800 font-semibold py-3 px-4 rounded shadow mb-4 ${
                    submitted ? "hidden" : "block"
                  } mx-auto`}
                  disabled={submitted}
                >
                  Continue to YC Registration ›
                </button>
                <button
                  type="button"
                  className={`bg-gray-500 font-semibold text-gray-800 py-3 px-4 rounded shadow mb-4 ${
                    submitted ? "block" : "hidden"
                  } mx-auto`}
                  disabled
                >
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-200 inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="bg-white p-2 mt-8 max-w-2xl mx-auto shadow-md rounded-sm">
          <h1 className="text-center text-xl font-bold my-2 text-gray-800">
            Our Partners
          </h1>
          <div className="flex justify-center flex-wrap">
            <img className="logo m-1 rounded-sm" src="/partners/mproduct.png" />
            <img className="logo m-1 rounded-sm" src="/partners/akpsi.png" />
            <img className="logo m-1 rounded-sm" src="/partners/shift.png" />
            <img
              className="logo m-1 rounded-sm p-2"
              src="/partners/geecs.png"
            />
            <img
              className="logo m-1 rounded-sm"
              src="/partners/blockchain.png"
            />
            <img className="logo m-1 rounded-sm" src="/partners/sepi.png" />
            <img className="logo m-1 rounded-sm" src="/partners/upround.png" />
            <img className="logo m-1 rounded-sm" src="/partners/mpowered.png" />
            <img className="logo m-1 rounded-sm" src="/partners/startum.png" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-gray-900 to-black">
        <p className="footer text-gray-200 text-center py-8">
          &copy; 2021 V1 | team@v1michigan.com
        </p>
      </div>
    </main>
  );
}
