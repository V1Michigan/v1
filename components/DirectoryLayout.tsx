import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import StartupTile from "./startups/StartupTile";
import { Startup } from "../utils/types";

type LayoutProps = {
  title: string;
  description: string;
  link: string;
};

const DirectoryLayout = (props: LayoutProps) => {
  const { title, description: directoryDescription, link: _ } = props;

  const [startups, setStartups] = useState<Startup[] | null>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      const { data } = await supabase.from("startups").select();
      setStartups(data);
    };
    fetchStartups();
  }, []);

  return (
    <div className="w-full p-4 md:p-8 flex flex-col items-center bg-gray-50">
      <div className="max-w-screen-2xl relative w-full">
        <div className=" flex flex-col items-center max-w-screen-2xl w-full static">
          <div className="w-full rounded-2xl p-16 bg-[url('/landing.jpg')]">
            <h1 className="font-bold text-white text-3xl mb-6">{title}</h1>
            <h3 className="font-regular text-white text-2xl mb-9">
              {directoryDescription}
            </h3>
            {/* <a href={link} target="_blank" rel="noreferrer">
              <p className="underline text-white hover:text-slate-500">
                {" "}
                Register a Startup{" "}
              </p>
            </a> */}
          </div>
        </div>
      </div>
      <div className="w-full max-w-screen-2xl mt-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
        {startups?.map((startup) => (
          <StartupTile startup={startup} key={startup.id} />
        ))}
      </div>
    </div>
  );
};

export default DirectoryLayout;
