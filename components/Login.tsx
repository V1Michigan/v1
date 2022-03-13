import { useState } from "react";
import useSupabase from "../hooks/useSupabase";
import { HOSTNAME } from "../pages/_app";
import GoogleSignIn from "./GoogleSignIn";

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
    <div className="bg-gradient h-screen flex flex-col items-center justify-center gap-y-6 px-8 text-center text-white">
      <div className="flex gap-x-4 items-center justify-center">
        <img
          src="V1_logo_round.png"
          className="h-20 w-auto"
          alt="V1 logo"
            />
        <h3 className="text-4xl">+</h3>
        <img
          src="block_m.svg"
          className="h-14 w-auto"
          alt="University of Michigan logo"
            />
      </div>
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
      <div className="flex items-center justify-center">
        <GoogleSignIn
          onClick={ handleGoogleSignup }
          disabled={ loading }
          />
        {submitError && <p className="text-red-500">{submitError}</p>}
      </div>
    </div>
  );
}
