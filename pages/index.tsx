import ReactGA from "react-ga4";
import Projects from "../components/Projects";
import NavbarBuilder from "../components/NavBar";
import Partners from "../components/Partners";
import People, { PeopleChips } from "../components/People";
import Head from "../components/Head";
import GoldButton from "../components/GoldButton";
import { CohortsApplyBanner } from "../components/Banner";
// import { StartupFairBanner } from "../components/Banner";

const TenX = () => (
  <>
    10
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-700">
      X
    </span>
  </>
);

export default function IndexPage() {
  return (
    <main>
      <Head title="University of Michigan" />
      {/* <StartupFairBanner /> */}
      {/* <CohortsApplyBanner /> */}
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
            <GoldButton
              text="Join us &rsaquo;"
              link="/join"
              onClick={() =>
                ReactGA.event({
                  category: "Join us",
                  action: "Clicked top landing page 'Join us' button",
                })
              }
            />
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

      <Partners />

      <People />

      <div className="bg-gray-100 py-10 flex flex-col justify-center items-center text-center gap-y-12">
        <h1 className="font-bold text-gray-900 text-4xl">
          You&apos;re in the right place.
        </h1>
        <PeopleChips />
        <GoldButton
          text="Join V1 &rsaquo;"
          link="/join"
          onClick={() =>
            ReactGA.event({
              category: "Join us",
              action: "Clicked bottom landing page 'Join us' button",
            })
          }
        />
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-black">
        <p className="footer text-gray-200 text-center font-semibold py-8">
          &copy; 2023 V1 |{" "}
          <a href="mailto:team@v1michigan.com">team@v1michigan.com</a>
        </p>
      </div>
    </main>
  );
}
