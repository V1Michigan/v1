import Link from "next/link";
import useSupabase from "../hooks/useSupabase";

const Step2Prompt = () => {
  const { rank } = useSupabase();
  if (rank !== 0) {
    // If rank > 0, should we show this, but "checked off"?
    return null;
  }
  return (
    <div className="bg-gray-100 max-w-sm rounded-md p-4 text-center flex flex-col">
      <h1 className="font-bold tracking-tight text-xl text-gray-900 mb-2">
        Finish filling out your profile
      </h1>
      <h2 className="text-gray-800">
        Tell us more about you and what you&apos;re excited about
      </h2>
      <div className="mt-auto">
        <Link href="/welcome" passHref>
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-500 text-gray-100 font-semibold py-3 px-4 rounded shadow hover:opacity-75"
            type="button"
          >
            Let&apos;s go &rsaquo;
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Step2Prompt;
