import Head from "next/head";
import { What, Offer, Join } from "../components/about";
import Projects from "../components/Projects";
import NavbarBuilder from "../components/NavBar";
// import Calendar from "../components/Calendar";
import People from "../components/People";

export default function IndexPage() {
  return (
    <main>
      <Head>
        <title>V1 | University of Michigan</title>
        <link rel="icon" href="/favicon.ico?v=1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="description"
          content="V1 is the community for ambitios student builders to connect and collaborate. "
        />
        <meta name="og:title" content="V1 | University of Michigan" />
        <meta
          name="og:description"
          content="V1 is the community for ambitios student builders to connect and collaborate. "
        />
        <meta property="og:image" content="/share.png" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavbarBuilder />

      <div className="bg-[url('/landing.jpg')] bg-cover">
        <div className="bg-gradient-to-r from-gray-900 to-black opacity-80">
          <div className="flex justify-center items-center text-center h-full py-48 max-w-4xl mx-auto">
            <h1 className="tracking-tightest text-white text-6xl font-extrabold p-4">
              V1 builds epic (10x) things.
              {/* We invest in smart people who believe they can do big things. */}
            </h1>
          </div>
          <h2 className="flex justify-center p-4 text-white text-xl italic">
            (or fails trying, but we're still shooting for the stars...)
          </h2>
        </div>
      </div>

      <div className="bg-gray-100 p-4">
        <h1 className="max-w-screen-xl mx-auto py-24 tracking-tightest text-center text-gray-800 text-5xl font-bold p-4">
          What's epic? See for yourself. ⚡
        </h1>

        <Projects />
      </div>

      <div className="bg-gray-200">
        <div className="max-w-4xl mx-auto py-24 px-4 leading-snug">
          <p className="tracking-tightest text-gray-900 text-3xl">
            <span className="font-extrabold">V1</span> is the community for
            ambitious student builders — engineers, artists, designers,
            founders, scientists, and more. Within V1, students build
            friendships, co-found ventures, and enable each other to reach their
            potential.
          </p>

          <p className="tracking-tightest text-gray-800 text-2xl mt-4">
            We provide the most driven students with an extraordinary network,
            exclusive opportunities within startups, and mentorship to grow and
            achieve great things.
          </p>
        </div>
      </div>

      <People />

      <div className="bg-gradient-to-r from-gray-900 to-black">
        <p className="footer text-gray-200 text-center py-8">
          &copy; 2022 V1 | team@v1michigan.com
        </p>
      </div>
    </main>
  );
}
