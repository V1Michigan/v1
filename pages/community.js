import Head from "next/head";

import CommunityForm from "../components/CommunityForm";

export default function CommunityPage() {
  return (
    <main>
      <Head>
        <title>V1 Community | University of Michigan</title>
        <link rel="icon" href="/favicon.ico?v=1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="description"
          content="A home for student-led entrepreneurship on the University of Michigan campus"
        />
     		<meta name="og:title" content="V1 Community | University of Michigan" />
        <meta
          name="og:description"
          content="A home for student-led entrepreneurship on the University of Michigan campus"
        />
        <meta property="og:image" content="/community.png" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head> 
			<div className="h-screen bg-gradient-to-r from-gray-900 to-black py-24">
				<div className="flex flex-wrap justify-center max-w-lg mx-auto">
					<div className="text-center text-white">
						<h1 className="text-6xl tracking-tight font-bold font-logo text-blue-100 leading-none">
							V1
						</h1>
						<h2 className="text-2xl tracking-tight font-normal m-0 p-0 text-gradient bg-gradient-to-r from-yellow-200 to-yellow-500">
							COMMUNITY 
						</h2>
						<p className="text-2xl mt-8 text-blue-100 font-light leading-tight tracking-tight px-5">
							The home for student-led entrepreneurship at the University of Michigan.
						</p>
					</div>
					<div className="w-full mt-10">
						<CommunityForm />
					</div>
				</div>
      </div>
    </main>
  );
};
