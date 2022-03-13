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
    <div className="bg-gradient flex h-screen items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="h-full max-w-md w-full space-y-8">
        <div>
          <img
            src={ logo.src }
            className="mx-auto h-20 w-auto"
            alt="V1 logo"
          />
          <h3 className="mt-6 text-center text-2xl font-medium text-white">Log in or sign up now &#8212; we love new faces!</h3>
          <p className="mt-6 text-center text-white">It only takes 2 minutes 😀</p>
        </div>
        <div className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 data-width:300 data-height:400 data-longtitle:true">
          <GoogleSignIn
            onClick={ handleGoogleSignup }
            disabled={ loading }
          />
        </div>
        {submitError && <p className="text-red-500">{submitError}</p>}
      </div>
    </div>
  );
}
