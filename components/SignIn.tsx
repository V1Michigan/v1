import Link from "next/link";
import { useState } from "react";
import ReactGA from "react-ga4";
import useSupabase from "../hooks/useSupabase";
import { HOSTNAME } from "../pages/_app";
import Head from "./Head";

interface GoogleSignInProps {
  text: string;
  disabled: boolean;
  onClick: () => void;
}

const GoogleSignIn = ({
  text,
  onClick,
  disabled = false,
}: GoogleSignInProps) => (
  <button
    className={`
      flex items-center justify-center py-2 px-4 rounded-md shadow-md
      bg-white hover:bg-gray-200 transition-colors duration-500
      text-gray-700 text-sm font-bold
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    `}
    type="button"
    disabled={disabled}
    onClick={onClick}
  >
    <p className="mr-2">{text}</p>
    <div className="flex items-center gap-x-2">
      <img
        src="block_m.svg"
        className="h-5 w-auto"
        alt="University of Michigan logo"
      />
      <p className="text-lg">+</p>
      <img src="google.svg" className="h-6 w-auto" alt="Google logo" />
    </div>
  </button>
);

const LOGIN_REDIRECT_URL = `${HOSTNAME}/dashboard`;
const SIGNUP_REDIRECT_URL = `${HOSTNAME}/welcome`;

interface SignInProps {
  isLoginPage: boolean;
}

// Used for both /login and /join, since the OAuth code is the same
export default function SignIn({ isLoginPage }: SignInProps) {
  const { signIn } = useSupabase();

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleGoogleSignIn = async (): Promise<void> => {
    ReactGA.event({
      category: isLoginPage ? "Log in" : "Sign up",
      action: `Clicked ${isLoginPage ? "Log in" : "Sign up"} button`,
    });
    setSubmitError(null);
    setLoading(true);
    const { error } = await signIn(
      { provider: "google" },
      // Redirect URLs must have the same hostname as the "Site URL" in the
      // Supabase Auth settings or be present in the "Additional Redirect URLs"
      // (additional redirects must match exactly)
      { redirectTo: isLoginPage ? LOGIN_REDIRECT_URL : SIGNUP_REDIRECT_URL }
    );
    if (error) {
      setSubmitError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient h-screen flex flex-col items-center justify-center gap-y-6 px-8 text-center text-white">
      <Head title={isLoginPage ? "Log in" : "Sign up"} />
      <img
        src="V1_logo_round.png"
        className="h-20 w-auto rounded-full shadow-md"
        alt="V1 logo"
      />
      <h3 className="text-4xl">
        Welcome to <b>V1</b>
      </h3>
      {isLoginPage ? (
        <p>
          <b>We missed you &#8212; welcome back! 🎉</b>
        </p>
      ) : (
        <p>
          <b>Don&apos;t have an account yet?</b> We love new faces! 😀
        </p>
      )}
      <p>
        Click below to {isLoginPage ? "log in" : "sign up"} with your umich.edu
        Google account.
      </p>
      <div className="flex items-center justify-center">
        <GoogleSignIn
          text={`Sign ${isLoginPage ? "in" : "up"} with umich.edu`}
          onClick={handleGoogleSignIn}
          disabled={loading}
        />
        {submitError && <p className="text-red-500">{submitError}</p>}
      </div>
      {/* The login/signup flow is exactly the same, but people may not understand that */}
      {isLoginPage ? (
        <Link href="/join" passHref>
          <p className="mt-4 text-center text-white link">
            Don&apos;t have an account?{" "}
            <span className="font-bold">Sign up here</span>
          </p>
        </Link>
      ) : (
        <Link href="/login" passHref>
          <p className="mt-4 text-center text-white link">
            Already have an account?{" "}
            <span className="font-bold">Log in here</span>
          </p>
        </Link>
      )}
    </div>
  );
}
