import { useState } from "react";
import useSupabase from "../hooks/useSupabase";
import { HOSTNAME } from "../pages/_app";
import GoogleSignIn from "./GoogleSignIn";

export default function Login() {
  const { signIn } = useSupabase();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  // TODO: Use Formik
  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!email || !password) {
      // eslint-disable-next-line no-alert
      alert("Please fill out all fields");
    } else {
      setLoading(true);
      const { error } = await signIn(
        { email, password },
        { redirectTo: `${HOSTNAME}/account` },
      );
      if (error) {
        // eslint-disable-next-line no-alert
        alert(error.message);
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    setLoading(true);
    const { error } = await signIn(
      { provider: "google" },
      { redirectTo: `${HOSTNAME}/account` },
    );
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="row flex flex-col w-1/2 gap-y-4">
      <div className="col-6 form-widget">
        <form onSubmit={ handleEmailLogin }>
          <div className="flex flex-col flex-center">
            <input
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={ email || "" }
              onChange={ (e) => setEmail(e.target.value) }
            />
            <input
              type="password"
              autoComplete="password"
              placeholder="Password"
              value={ password || "" }
              onChange={ (e) => setPassword(e.target.value) }
            />
            <input type="submit" value="Login ›" disabled={ loading } />
          </div>
        </form>
      </div>
      <GoogleSignIn
        onClick={ handleGoogleLogin }
        disabled={ loading }
      />
    </div>
  );
}
