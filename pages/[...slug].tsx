import { getLinkPreview } from "link-preview-js";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Redirect from "../components/Redirect";
import supabase from "../utils/supabaseClient";

interface DynamicLinkData {
  name: string;
  link: string;
  title?: string;
  description?: string;
  image_url?: string;
}

interface UTMData {
  tag: string;
}

interface Props {
  initialRoute: string;
  metadata: {
    title: string;
    description: string;
    imageUrl: string;
  };
  currentUrl: string;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  query,
}) => {
  const slug = params?.slug as string[];
  const slugRoute = slug.join("/");

  const { data } = await supabase
    .from<DynamicLinkData>("dynamic_links")
    .select()
    .eq("name", slugRoute)
    .single();

  const initialRoute = data?.link || "404";

  interface Metadata {
    title: string;
    description: string | undefined;
    imageUrl: string;
  }

  let metadata: Metadata = {
    title: "",
    description: "",
    imageUrl: "",
  };

  type LinkPreviewResult = Awaited<ReturnType<typeof getLinkPreview>>;

  if (initialRoute !== "404") {
    const preview: LinkPreviewResult = await getLinkPreview(initialRoute, {
      followRedirects: "follow",
    });

    let imageUrl = "";
    if ("images" in preview && preview.images.length > 0) {
      [imageUrl] = preview.images;
    } else if (preview.mediaType === "image") {
      imageUrl = preview.url;
    }

    metadata = {
      title: "title" in preview ? preview.title : "Untitled",
      description:
        "description" in preview
          ? preview.description
          : "Powered by V1 @ Michigan",
      imageUrl,
    };
  }

  // Use custom metadata if available, otherwise use fetched metadata
  if (data) {
    metadata = {
      title: data.title || metadata.title,
      description: data.description || metadata.description,
      imageUrl: data.image_url || metadata.imageUrl,
    };
  }

  // Check for both Netlify's x-scheme and standard x-forwarded-proto
  const protocol =
    req.headers["x-scheme"] ||
    req.headers["x-forwarded-proto"]?.[0] ||
    (req.headers["x-forwarded-scheme"] as string) ||
    "https"; // Default to https instead of http

  const { host } = req.headers;
  const currentUrl = `${protocol}://${host ?? "v1michigan.com"}/${slugRoute}`;

  return {
    props: {
      initialRoute,
      metadata,
      currentUrl,
    },
  };
};

const DynamicLink: NextPage<Props> = ({
  initialRoute,
  metadata,
  currentUrl,
}: Props) => {
  const [route, setRoute] = useState<string>(initialRoute);
  const domain = new URL(currentUrl).hostname;

  useEffect(() => {
    setRoute(initialRoute);
  }, [initialRoute]);

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <link rel="canonical" href={currentUrl} />
        <meta name="description" content={metadata.description} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={domain} />
        <meta property="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.imageUrl} />
      </Head>
      {route && <Redirect route={route} />}
    </div>
  );
};

export default DynamicLink;
