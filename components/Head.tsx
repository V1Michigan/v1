import Head from "next/head";

interface HeaderProps {
    title: string | null
}
export default function Header({ title }: HeaderProps) {
  return (
    <Head>
      <title>
        V1 |
        {title}
      </title>
      <link rel="icon" href="/favicon.ico?v=1" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta
        name="description"
        content="V1 is a monthly newsletter for ambitious engineering and design
          students at the University of Michigan who are looking to build something great."
        />
      <meta name="og:title" content="V1 | University of Michigan" />
      <meta
        name="og:description"
        content="V1 is a monthly newsletter for ambitious engineering and design
          students at the University of Michigan who are looking to build something great."
        />
      <meta property="og:image" content="/share.png" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
}
