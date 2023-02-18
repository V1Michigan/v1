// 404.js
import { useEffect } from "react";
import InternalLink from "../components/Link";

export default function Custom404() {
  useEffect(() => {
    document.body.classList.add("bg-gray-800");
    return () => {
      document.body.classList.remove("bg-gray-800");
    };
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="absolute top-0 left-0 w-full bg-gray-800 flex justify-center flex-grow pt-16">
          <InternalLink href="/">
            <img className="w-20" src="/v1logowhite.svg" alt="V1 Logo" />
          </InternalLink>
        </div>
        <div className="h-screen flex flex-col items-center justify-center bg-gray-800">
          <h1 className="text-8xl font-bold text-gray-200 flex items-center">
            <span>404</span>
            <span className="border-l mx-4 h-full" />
            <span className="text-gray-200 text-2xl">Page not found</span>
          </h1>
        </div>
      </div>
    </>
  );
}
