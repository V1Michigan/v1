import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import Account from '../components/Account'
import LoggedIn from '../hooks/loggedin';
export default function Login() {
    const session = LoggedIn();
    console.log(session);
  return (
    <div style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}