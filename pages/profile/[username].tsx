import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSupabase from "../../hooks/useSupabase";
import ProtectedRoute from "../../components/ProtectedRoute";
import ViewProfile from "../../components/profile/ViewProfile";

// Username included separately
export type Profile = {
  id: string;
  email: string;
  name: string;
  phone: string; // Not sure this should be public
  // cohort: string;  For the future...
  year: string,
  fields_of_study: {
    majors: string[],
    minors: string[],
  },
  linkedin: string,
  website: string,
  roles: string[],
  interests: string[],
}
const PROFILE_COLUMNS = "id, email, name, phone, year, fields_of_study, linkedin, website, roles, interests";

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { username: profileUsername } = router.query;
  const { supabase, username: currentUsername } = useSupabase();
  const isCurrentUser = profileUsername === currentUsername;

  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error, status } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("username", profileUsername)
        .single();

      if ((error && status !== 406) || !data) {
        router.replace("/404");
      } else {
        setProfileData(data);
      }
    };
    fetchProfile();
  }, [supabase, profileUsername, router]);

  useEffect(() => {
    if (!profileData) {
      return;
    }
    const getAvatarUrl = async () => {
      const { data, error } = await supabase.storage.from("avatars").download(profileData.id);
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
  }, [profileData, supabase]);

  if (!profileUsername || typeof profileUsername !== "string" || !profileData) {
    return null;
  }

  return (
    <div>
      {/* TODO: Edit avatar */}
      { avatarUrl && (
        <img
          src={ avatarUrl }
          className="w-32 h-32 rounded-full m-2 border-black border-2"
          alt="Profile"
        />
      )}

      <ViewProfile
        username={ profileUsername }
        profile={ profileData }
      />

      {/* TODO: Show + edit resume */}

      <div className="mt-4">
        <button
          className="button block"
          onClick={ () => supabase.auth.signOut() }
          type="button"
        >
          Sign Out
        </button>
      </div>

    </div>
  );
};

export default () => (
  <ProtectedRoute>
    <UserProfile />
  </ProtectedRoute>
);
