import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import Account from '../components/Account'

export default function LoggedIn() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())
  }, [])
    console.log(session)
  return session;
}