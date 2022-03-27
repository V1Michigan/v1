import Head from "next/head";
import ReactGA from "react-ga4";
import { What, Offer, Join } from "../components/about";
import Projects from "../components/Projects";
import NavbarBuilder from "../components/NavBar";
import Calendar from "../components/Calendar";
import useSupabase from "../hooks/useSupabase";
import InternalLink from "../components/Link";

export default function IndexPage() {
  const { user } = useSupabase();
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
            <h1 className="tracking-tightest text-white text-8xl font-extrabold p-4">
              It's time to build.
              {/* We invest in smart people who believe they can do big things. */}
            </h1>
          </div>
        </div>
      </div>

      <div className="h-screen">
        <div className="p-6 max-w-screen-xl mx-auto">
          <h1 className="tracking-tightest text-center text-gray-900 text-4xl font-bold p-4">
            If you're in V1, you're building something incredible.
          </h1>
        </div>
      </div>

      <Projects />
      <What />
      <Offer />
      <Calendar />
      <Join />

      <div className="bg-gradient-to-r from-gray-900 to-black">
        <p className="footer text-gray-200 text-center py-8">
          &copy; 2022 V1 | team@v1michigan.com
        </p>
      </div>
    </main>
  );
}
