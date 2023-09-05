import { useState, useEffect } from 'react';
import supabase from "../utils/supabaseClient";
import StartupTile from "./startups/StartupTile";
import StartupFilter from "./startups/StartupFilter";

type LayoutProps = {
  title: string;
  description: string;
  link: string;
};

const STARTUPS = [
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
  {
    name: "Ramp",
    description:
      "Ramp is the leading provider of corporate cards and spend management software. Ramp helps businesses spend less by providing visibility and control over all company spend, while helping finance teams deliver real-time insights and reports. Ramp’s customers have saved over $100M to date.",
    website: "https://ramp.com/",
    logo: "startups/ramp.png",
  },
  {
    name: "Warp",
    description:
      "Warp is a terminal for the 21st century. It brings the power of the cloud to your local machine, and gives you the tools to build the next generation of web applications.",
    website: "https://lumosapp.com/",
    logo: "startups/warp_square.png",
  },
];

const DirectoryLayout = (props: LayoutProps) => {
  const { title, description: directoryDescription, link } = props;
  const [startups, setStartups] = useState(STARTUPS);
  useEffect(() => {
    const fetchStartups = async () => {
      const { data, error } = await supabase
        .from('startups')
        .select();
      console.log('data', data);
    };
    fetchStartups();
  }, [startups]);

  return (
    <div className="w-full p-4 md:p-8 flex flex-col items-center bg-gray-50">
      <div className="max-w-screen-2xl relative w-full">
        <div className=" flex flex-col items-center max-w-screen-2xl w-full static">
          <div className="w-full rounded-2xl p-16 bg-[url('/landing.jpg')]">
            <h1 className="font-bold text-white text-3xl mb-6">{title}</h1>
            <h3 className="font-regular text-white text-2xl mb-9">
              {directoryDescription}
            </h3>
            <a href={link} target="_blank" rel="noreferrer">
              <p className="underline text-white hover:text-slate-500">
                {" "}
                Register a Startup{" "}
              </p>
            </a>
          </div>
          <StartupFilter />
        </div>
      </div>
      <div className="w-full max-w-screen-2xl mt-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
        {startups.map(({ name, logo, website, description }) => (
          <StartupTile
            logo={logo}
            name={name}
            description={description}
            websiteLink={website}
          />
        ))}
      </div>
    </div>
  );
};

export default DirectoryLayout;
