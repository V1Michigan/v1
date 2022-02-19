import { useState } from 'react';
import supabase from '../utils/supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ provider: 'google' });
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
        <p className="description">Sign in via google below</p>
        <div />
        <div>
          <button
            onClick={ (e) => {
              e.preventDefault();
              handleLogin();
            } }
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
