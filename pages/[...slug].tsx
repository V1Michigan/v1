import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
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

  return route ? (
    <div>
      <Head>
        <title>V1’s Recruiting Playbook | Notion</title>
        <meta
          name="description"
          content="Hi everyone! This guide will be curated by Dev Kunjadia on how to recruit for software engineering internships and full time offers! Contact me at devk@umich.edu if you have any suggestions."
        />

        <meta
          property="og:url"
          content="https://v1community.notion.site/V1-s-Recruiting-Playbook-0f12927af1e9457787c27f43e325685c"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="V1’s Recruiting Playbook | Notion" />
        <meta
          property="og:description"
          content="Hi everyone! This guide will be curated by Dev Kunjadia on how to recruit for software engineering internships and full time offers! Contact me at devk@umich.edu if you have any suggestions."
        />
        <meta
          property="og:image"
          content="https://v1community.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fc5808856-ccf9-4316-8b86-323de7039901%2F08ae5676-95bd-4a2d-8807-48eba14c7c7f%2FSocialMediaPreviewImage.png?table=block&id=0f12927a-f1e9-4577-87c2-7f43e325685c&spaceId=c5808856-ccf9-4316-8b86-323de7039901&width=2000&userId=&cache=v2"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="v1community.notion.site" />
        <meta
          property="twitter:url"
          content="https://v1community.notion.site/V1-s-Recruiting-Playbook-0f12927af1e9457787c27f43e325685c"
        />
        <meta
          name="twitter:title"
          content="V1’s Recruiting Playbook | Notion"
        />
        <meta
          name="twitter:description"
          content="Hi everyone! This guide will be curated by Dev Kunjadia on how to recruit for software engineering internships and full time offers! Contact me at devk@umich.edu if you have any suggestions."
        />
        <meta
          name="twitter:image"
          content="https://v1community.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fc5808856-ccf9-4316-8b86-323de7039901%2F08ae5676-95bd-4a2d-8807-48eba14c7c7f%2FSocialMediaPreviewImage.png?table=block&id=0f12927a-f1e9-4577-87c2-7f43e325685c&spaceId=c5808856-ccf9-4316-8b86-323de7039901&width=2000&userId=&cache=v2"
        />
      </Head>
      <Redirect route={route} />
    </div>
  ) : null;
};

export default DynamicLink;
