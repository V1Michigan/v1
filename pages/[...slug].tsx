import { NextPage } from "next";
import Redirect from "../components/Redirect";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../utils/supabaseClient";

const DynamicLink: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [route, setRoute] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      // NextJS routes to an empty slug before going to slug.
      // So we check for this condition to prevent memory leaks from the supbase fetch request.
      if (!slug) {
        return;
      }

      const { data } = await supabase
        .from("dynamic_links")
        .select()
        .eq("name", slug);

      if (!data || data?.length === 0 || !data?.[0].link) {
        setRoute("404");
        return;
      }

      setRoute(data?.[0].link);
    };

    fetchData();
    return () => {};
  }, [slug]);

  return route ? <Redirect route={route} /> : null;
};

export default DynamicLink;
