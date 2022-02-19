import Auth from '../components/Auth';
import Account from '../components/Account';
import useSupabaseSession from '../hooks/useSupabaseSession';

export default function Login() {
  const session = useSupabaseSession();
  return (
    <div style={ { padding: '50px 0 100px 0' } }>
      {!session ? <Auth /> : <Account key={ session.user.id } session={ session } />}
    </div>
  );
}
