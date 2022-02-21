import { useState } from 'react';
import useSupabase from '../hooks/useSupabase';

export default function Login() {
  const { signIn } = useSupabase();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await signIn({ provider: 'google' },
        {
          // Redirect URLs must have the same hostname as the "Site URL" in the
          // Supabase Auth settings or be present in the "Additional Redirect URLs"
          // (additional redirects must match exactly)
          redirectTo: 'http://localhost:3000/login',
        });
      if (error) throw error;
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <p className="description">Sign in via Google below</p>
        <div />
        <div>
          <button
            onClick={ handleLogin }
            className="button block"
            disabled={ loading }
            type="button"
          >
            <span>{loading ? 'Loading' : 'Sign in'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
