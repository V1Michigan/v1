import { useState } from "react";
import useSupabase from "../hooks/useSupabase";
import { HOSTNAME } from "../pages/_app";
import GoogleSignIn from "./GoogleSignIn";

export default function SignUp() {
  const { signIn, signUp } = useSupabase();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string | null>(null);

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!email || !password || !passwordConfirm) {
      // eslint-disable-next-line no-alert
      alert("Please fill out all fields");
    } else if (password !== passwordConfirm) {
      // eslint-disable-next-line no-alert
      alert("Passwords do not match");
    } else {
      setLoading(true);
      const { user: existingUser, session, error } = await signUp({ email, password },
        {
          // Redirect URLs must have the same hostname as the "Site URL" in the
          // Supabase Auth settings or be present in the "Additional Redirect URLs"
          // (additional redirects must match exactly)
          redirectTo: `${HOSTNAME}/join`,
        });
      if (existingUser && session) {
        // From https://supabase.com/docs/reference/javascript/auth-signup#notes:
        //   New users: a user is returned but session will be null
        //   Existing users: an obfuscated / fake user object will be returned.
        // eslint-disable-next-line no-alert
        alert("Found an existing user...redirecting to /login");
        // TODO: Redirect to /login
      } else if (error) {
        // eslint-disable-next-line no-alert
        alert(error.message);
      } else {
        // Per https://github.com/supabase/supabase/discussions/3526,
        // there's no way to resend the verification email...
        // eslint-disable-next-line no-alert
        alert(`We've sent an email to ${email} — please click the link to verify your email`);
      }
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (): Promise<void> => {
    setLoading(true);
    const { error } = await signIn(
      { provider: "google" },
      { redirectTo: `${HOSTNAME}/join` },
    );
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <form onSubmit={ handleEmailSignup }>
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
              autoComplete="new-password"
              placeholder="Password"
              value={ password || "" }
              onChange={ (e) => setPassword(e.target.value) }
          />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={ passwordConfirm || "" }
              onChange={ (e) => setPasswordConfirm(e.target.value) }
          />
            {password && passwordConfirm && password !== passwordConfirm
            && <p className="text-red-500">Passwords must match</p>}
            <input type="submit" value="Let's go ›" disabled={ loading } />
          </div>
        </form>
        <GoogleSignIn
          onClick={ handleGoogleSignup }
          disabled={ loading }
          />
      </div>
    </div>
  );
}
