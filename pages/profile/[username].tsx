import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import ViewProfile from "../../components/profile/ViewProfile";
import ViewResume from "../../components/profile/ViewResume";
import ViewAvatar from "../../components/profile/ViewAvatar";
import isObjectEqual from "../../utils/isObjectEqual";
import useSupabase from "../../hooks/useSupabase";

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
  avatar: File,
  resume: File,
}
const PROFILE_COLUMNS = "id, email, name, phone, year, fields_of_study, linkedin, website, roles, interests";

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { username: profileUsername } = router.query;
  const { supabase, username: currentUsername } = useSupabase();
  const isCurrentUser = profileUsername === currentUsername;

  const [editMode, toggleEditMode] = useReducer((x) => !x, false);

  const [profileData, setProfileData] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: data_, error, status } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("username", profileUsername)
        .single();
      const data = data_ as Omit<Profile, "avatar" | "resume">;

      if ((error && status !== 406) || !data) {
        router.replace("/404");
      } else {
        // TODO: This blocks rendering until the avatar and resume are fetched,
        // consider rendering as soon as DB data fetched
        // TODO: Handle errors
        const [{ data: avatar }, { data: resume }] = await Promise.all([
          supabase.storage.from("avatars").download(data.id),
          supabase.storage.from("resumes").download(`${data.id}.pdf`),
        ]);
        setProfileData({
          ...data,
          avatar: new File([avatar as BlobPart], "avatar"),
          resume: new File([resume as BlobPart], `${profileUsername} Resume.pdf`),
        });
      }
    };
    fetchProfileData();
  }, [supabase, profileUsername, router]);

  if (!profileUsername || typeof profileUsername !== "string" || !profileData) {
    return null;
  }

  return (
    <div>
      {/* TODO: Edit avatar */}
      <ViewAvatar avatar={ profileData.avatar } />

      <ViewProfile
        username={ profileUsername }
        profile={ profileData }
      />

      {/* TODO: Edit resume */}
      {profileData.resume && <ViewResume resume={ profileData.resume } />}

      <div className="mt-4">
        {isCurrentUser && (
          <button
            className="button block"
            onClick={ toggleEditMode }
            type="button"
          >
            {editMode ? "Save Profile" : "Edit Profile"}
          </button>
        )}
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
