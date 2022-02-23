import { useState, useEffect } from "react";
import useSupabase from "../hooks/useSupabase";

export default function Account() {
  const { supabase, user } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  async function getProfile() {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("users")
        .select("username, website, avatar_url")
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, [user]);

  async function updateProfile({ newUsername, newWebsite, newAvatarUrl }) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username: newUsername,
        website: newWebsite,
        avatar_url: newAvatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">
          Email
          <input id="email" type="text" value={ user.email } disabled />
        </label>
      </div>
      <div>
        <label htmlFor="username">
          Name
          <input
            id="username"
            type="text"
            value={ username || "" }
            onChange={ (e) => setUsername(e.target.value) }
        />
        </label>
      </div>
      <div>
        <label htmlFor="website">
          Website
          <input
            id="website"
            type="website"
            value={ website || "" }
            onChange={ (e) => setWebsite(e.target.value) }
        />
        </label>
      </div>

      <div>
        <button
          className="button block primary"
          onClick={ () => updateProfile({ username, website, avatarUrl }) }
          disabled={ loading }
          type="button"
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={ () => {
            supabase.auth.signOut();
          } }
          type="button">
          Sign Out
        </button>
      </div>
    </div>
  );
}
