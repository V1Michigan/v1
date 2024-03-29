import { useEffect } from "react";
import { useRouter } from "next/router";
import InternalLink from "../components/Link";
import ErrorButtons from "../components/ErrorButtons";

// modified from 404.tsx
export default function Custom500() {
  const router = useRouter();
  const { msg } = router.query;

  // adds bg-gray-800 to body on mount and removes it on unmount
  // i wanted to make area outside viewport colored (when you scroll up or down past the page)
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
          <h1 className="text-2xl lg:text-6xl font-bold text-gray-200 flex items-center">
            Unexpected error occurred :(
          </h1>
          {msg && (
            <p className="text-2xl text-gray-200 font-mono mt-8">
              <code className="text-gray-200">{msg}</code>
            </p>
          )}
          <ErrorButtons />
        </div>
      </div>
    </>
  );
}
