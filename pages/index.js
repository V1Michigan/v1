import Head from "next/head";

import Form from "../components/Form";
import { What, Special, Expect } from "../components/landing";

export default function IndexPage() {
  return (
    <main>
      <Head>
        <title>V1 | University of Michigan</title>
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
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-md text-center text-white">
          <h1 className="text-6xl tracking-tight font-bold font-logo text-blue-100 leading-none">
            V1
          </h1>
          <h2 className="text-2xl tracking-tight font-normal italic m-0 p-0 text-gradient bg-gradient-to-r from-yellow-200 to-yellow-500">
            at Michigan
          </h2>
          <p className="text-2xl mt-8 text-blue-100 font-light leading-tight tracking-tight px-5">
            Because the next generation of technology products won&apos;t be
            built in a classroom.
          </p>
          <a
            href="#form"
            type="button"
            className="bg-gradient-to-r from-yellow-200 to-yellow-500 hover:bg-blue-500 text-gray-800 font-semibold py-2 px-4 rounded shadow mt-12 hover:opacity-75"
          >
            Request an invite
          </a>
        </div>
      </div>

      <What />

      <Special />

      <Expect />

      <div
        id="form"
        className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 to-black"
      >
        <Form />
      </div>
    </main>
  );
}
