import React, { useEffect, useState } from 'react';
import ReactGA from "react-ga4";
import Projects from "../components/Projects";
import NavbarBuilder from "../components/NavBar";
import Partners from "../components/Partners";
import People, { PeopleChips } from "../components/People";
import Head from "../components/Head";
import GoldButton from "../components/GoldButton";
import Banner from "../components/Banner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = require('@supabase/supabase-js').createClient(supabaseUrl, supabaseKey);

const TenX = () => (
  <>
    10
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-700">
      X
    </span>
  </>
);

export default function IndexPage() {
  interface BannerData {
    id: number;
    message: string;
    link: string | null;
    buttonText: string | null;
  }
  
  const [banners, setBanners] = useState<BannerData[] | null>(null);
  const [error, setError] = useState<boolean>([]);
  const [toggle, setToggle] = useState<boolean>(false);

  useEffect(() => {
    const fetchBanners = async () => {      
      let { data: data1, error1 } = await supabase
      .from('bannerflags')
      .select('*')
      .eq('banner_id', '_startupfairPage');

      if (error1) {
        console.error('Error fetching banner flags:', error1);
        setError(true)
      } else {
        console.log('Data:', data1);
        let realQuery = data1[0].link;
        let { data: data2, error2 } = await supabase
        .from('bannerflags')
        .select('*')
        .eq('banner_id', `${realQuery}`);
        if (realQuery == "false") {
          setToggle(false);
        }

        if (error2) {
          console.error('Error fetching banner flags:', error2);
          setError(true);
        } else {
          setBanners(data2 || []); 
          console.log('Data:', data2);
        }
      }
    };

    fetchBanners();
  }, []);

  return (
    <main>
      <Head title="University of Michigan" />
      <NavbarBuilder />

      {(error || banners?.length) == 0 && toggle ? (
          <Banner
          key={"error"} // Unique key for each banner
          text={
          <>
            {"Invalid banner ID. Please try again later."}
          </>
          }
          link={'#'} // Provide a default link if none exists
          buttonText={'Learn more'} // Provide a default button text if none exists
          open={true}
        />
      ) : (
      banners && banners.map((banner) =>
        banner.message?.length > 0 && (
        <Banner
          key={banner.id} // Unique key for each banner
          text={
          <>
            {banner.message}
          </>
          }
          link={banner.link || '#'} // Provide a default link if none exists
          buttonText={banner.buttonText || 'Learn more'} // Provide a default button text if none exists
          open={true}
        />
        )
      )
      )}

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
        &copy; 2024 V1 @ Michigan |{" "}
        <a href="mailto:team@v1michigan.com">team@v1michigan.com</a>
      </p>
      </div>
    </main>
  );
}
