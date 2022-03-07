import { useState, useEffect } from "react";
import useSupabase from "../hooks/useSupabase";

export default function Account() {
  const { supabase, user } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // useEffect to download avatarUrl from Supabase
  useEffect(() => {
    if (!user) {
      return;
    }
    const getAvatarUrl = async () => {
      const { data, error } = await supabase.storage.from("avatars").download(user.id);
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } else if (!data) {
        // eslint-disable-next-line no-console
        console.error("No avatar found");
      } else {
        setAvatarUrl(URL.createObjectURL(data));
      }
    };
    getAvatarUrl();
  }, [user, supabase]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);

        const { data, error, status } = await supabase
          .from("profiles")
          .select("username, website")
          .eq("id", user?.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setWebsite(data.website);
        }
      } catch (error) {
      // eslint-disable-next-line no-alert
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [supabase, user]);

  async function updateProfile(newUsername, newWebsite, newAvatarUrl) {
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
      {avatarUrl && (
        <img
          src={ avatarUrl }
          className="w-32 h-32 rounded-full m-2 border-black border-2"
          alt="Profile"
        />
      )}
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
          onClick={ () => updateProfile(username, website, avatarUrl) }
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
