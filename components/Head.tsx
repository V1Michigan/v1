import NextHead from "next/head";

interface HeadProps {
  title: string;
}
export default function Head({ title }: HeadProps) {
  return (
    <NextHead>
      <title>V1 | {title}</title>
      <link rel="icon" href="/favicon.ico?v=1" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta
        name="description"
        content="V1 is the community for ambitious student builders at the University of Michigan."
      />
      <meta name="og:title" content="V1 | University of Michigan" />
      <meta
        name="og:description"
        content="V1 is the community for ambitious student builders at the University of Michigan."
      />
      <meta property="og:image" content="/share.png" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </NextHead>
  );
}
