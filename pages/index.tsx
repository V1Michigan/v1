import Head from "next/head";
import InternalLink from "../components/Link";
import Projects from "../components/Projects";
import NavbarBuilder from "../components/NavBar";
import People, { PeopleChips } from "../components/People";
import Fade from "../components/Fade";

const TenX = () => (
  <>
    10
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-700">
      X
    </span>
  </>
);

const JoinButton = ({ text }: { text: string }) => (
  <Fade motion={false}>
    <InternalLink href="/join">
      <button
        type="button"
        className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:bg-blue-500 hover:opacity-75 hover:shadow-lg text-gray-100 text-lg font-semibold py-3 px-4 transition duration-300 rounded shadow"
      >
        {text}
      </button>
    </InternalLink>
  </Fade>
);

export default function IndexPage() {
  return (
    <main>
      {/* TODO: Use our own <Head> component */}
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

      <div className="overflow-hidden h-screen bg-[url('/landing.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="h-full w-full bg-gradient-to-r from-gray-900/80 to-black/80">
          <div className="h-full max-w-4xl mx-auto flex flex-col gap-y-8 justify-center items-center text-center">
            <h1 className="tracking-tightest text-white text-5xl md:text-7xl lg:text-8xl font-extrabold p-4">
              V1 builds <TenX /> {/* "things" instead of "projects"? */}
              projects.
              {/* It's time to build. */}
              {/* We invest in smart people who believe they can do big things. */}
            </h1>
            <JoinButton text="Join us &rsaquo;" />
          </div>
        </div>
      </div>

      <div className="bg-gray-200">
        <div className="max-w-4xl mx-auto py-24 px-4 leading-snug">
          <p className="tracking-tightest text-gray-900 text-3xl">
            <span className="font-extrabold">V1</span> is the community for
            ambitious student builders — engineers, artists, designers,
            founders, scientists, and more. We provide the most driven students
            with an extraordinary network, exclusive opportunities within
            startups, and mentorship to grow and achieve great things.
          </p>
        </div>
      </div>

      <div className="bg-gray-100 p-4">
        <h1 className="max-w-screen-xl mx-auto py-12 tracking-tightest text-center text-gray-800 text-4xl md:text-5xl font-bold p-4">
          What&apos;s <TenX />? See for yourself. ⚡
        </h1>
        <Projects />
      </div>

      <People />

      <div className="bg-gray-100 py-10 flex flex-col justify-center items-center text-center gap-y-12">
        <h1 className="font-bold text-gray-900 text-4xl">
          You&apos;re in the right place.
        </h1>
        <PeopleChips />
        <JoinButton text="Join V1 &rsaquo;" />
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-black">
        <p className="footer text-gray-200 text-center font-semibold py-8">
          &copy; 2022 V1 |{" "}
          <a href="mailto:team@v1michigan.com">team@v1michigan.com</a>
        </p>
      </div>
    </main>
  );
}
