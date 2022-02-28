import { useState } from "react";
import useSupabase from "../hooks/useSupabase";

export default function SignUp() {
  const { signIn, signUp } = useSupabase();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string | null>(null);

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    if (!email || !password || !passwordConfirm) {
      // eslint-disable-next-line no-alert
      alert("Please fill out all fields");
    } else if (password !== passwordConfirm) {
      // eslint-disable-next-line no-alert
      alert("Passwords do not match");
    } else {
      const { error } = await signUp({ email, password },
        {
          // Redirect URLs must have the same hostname as the "Site URL" in the
          // Supabase Auth settings or be present in the "Additional Redirect URLs"
          // (additional redirects must match exactly)
          redirectTo: "http://localhost:3000/join",
        });
      if (error) {
        // eslint-disable-next-line no-alert
        alert(error.message);
      }
    }
    setLoading(false);
  };

  const handleGoogleSignup = async (): Promise<void> => {
    setLoading(true);
    const { error } = await signIn(
      { provider: "google" },
      { redirectTo: "http://localhost:3000/login" },
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
              placeholder="Email"
              value={ email || "" }
              onChange={ (e) => setEmail(e.target.value) }
          />
            <input
              type="password"
              placeholder="Password"
              value={ password || "" }
              onChange={ (e) => setPassword(e.target.value) }
          />
            <input
              type="password"
              placeholder="Confirm password"
              value={ passwordConfirm || "" }
              onChange={ (e) => setPasswordConfirm(e.target.value) }
          />
            {password && passwordConfirm && password !== passwordConfirm
            && <p className="error">Passwords must match</p>}
            <input type="submit" value="Let's go ›" disabled={ loading } />
          </div>
        </form>
        <div>
          <button
            onClick={ handleGoogleSignup }
            className="button block"
            disabled={ loading }
            type="button"
          >
            {loading ? "Loading" : "Sign in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}
