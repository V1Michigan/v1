import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Redirect from "../components/Redirect";
import supabase from "../utils/supabaseClient";

interface DynamicLinkData {
  name: string;
  link: string;
}

const DynamicLink: NextPage = () => {
  const router = useRouter();

  const slug = router.query.slug as string[];
  const [route, setRoute] = useState<string>("");

  // * Todo: Need to consider if slug is an array of multiple directories
  // * ie -> v1michigan.com/<name>/<name2>, currently we only support v1michigan.com/<name>

  useEffect(() => {
    const fetchData = async () => {
      // NextJS routes to an empty slug before going to slug.
      // So we check for this condition to prevent memory leaks from the supbase fetch request.
      if (!slug) {
        return;
      }

      const slugRoute = slug.join("/");

      const { data } = await supabase
        .from<DynamicLinkData>("dynamic_links")
        .select()
        .eq("name", slugRoute);

      if (!data || data?.length === 0 || !data?.[0].link) {
        setRoute("404");
        return;
      }

      setRoute(String(data?.[0].link));
    };

    fetchData();
  }, [slug]);

  return route ? <Redirect route={route} /> : null;
};

export default DynamicLink;
