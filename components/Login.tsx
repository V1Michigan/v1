import { useState } from "react";
import useSupabase from "../hooks/useSupabase";
import { HOSTNAME } from "../pages/_app";
import GoogleSignIn from "./GoogleSignIn";
import logo from "../public/V1_logo_round.png";

const REDIRECT_URL = `${HOSTNAME}/profile`;

export default function Login() {
  const { signIn } = useSupabase();

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleGoogleSignup = async (): Promise<void> => {
    setSubmitError(null);
    setLoading(true);
    const { error } = await signIn(
      { provider: "google" },
      // Redirect URLs must have the same hostname as the "Site URL" in the
      // Supabase Auth settings or be present in the "Additional Redirect URLs"
      // (additional redirects must match exactly)
      { redirectTo: REDIRECT_URL },
    );
    if (error) {
      setSubmitError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient h-full w-screen">
      <div className="h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-y-6 text-center text-white">
          <img
            src={ logo.src }
            className="mx-auto h-20 w-auto"
            alt="V1 logo"
          />
          <h3 className="text-4xl">
            Welcome to
            {" "}
            <b>V1</b>
          </h3>
          <div>
            <p>
              <b>Returning user?</b>
              {" "}
              We missed you &#8212; welcome back! 🎉
            </p>
            <p>
              Click below to log in with your umich.edu Google account.
            </p>
          </div>
          <div>
            <p>
              <b>Don&apos;t have an account yet?</b>
              {" "}
              We love new faces! 😀
            </p>
            <p>
              Click below to sign up with your umich.edu Google account.
            </p>
          </div>
        </div>
        <div className="group relative w-full flex justify-center mt-6 p-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 data-width:300 data-height:400 data-longtitle:true">
          <GoogleSignIn
            onClick={ handleGoogleSignup }
            disabled={ loading }
          />
          {submitError && <p className="text-red-500">{submitError}</p>}
        </div>
      </div>
    </div>
  );
}
