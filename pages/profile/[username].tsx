import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import useSupabase from "../../hooks/useSupabase";
import ProtectedRoute from "../../components/ProtectedRoute";
import ViewProfile from "../../components/profile/ViewProfile";
import ViewResume from "../../components/profile/ViewResume";
import ViewAvatar from "../../components/profile/ViewAvatar";

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
  avatarUrl: string,
  resumeUrl: string,
}
const PROFILE_COLUMNS = "id, email, name, phone, year, fields_of_study, linkedin, website, roles, interests";

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { username: profileUsername } = router.query;
  const { supabase, username: currentUsername } = useSupabase();
  const isCurrentUser = profileUsername === currentUsername;

  const [dbProfileData, setDBProfileData] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

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
        setDBProfileData(data);
      }
    };
    fetchProfile();
  }, [supabase, profileUsername, router]);

  useEffect(() => {
    if (!dbProfileData) {
      return;
    }
    const getAvatarUrl = async () => {
      const { data, error } = await supabase.storage.from("avatars").download(dbProfileData.id);
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
  }, [dbProfileData, supabase]);

  useEffect(() => {
    if (!dbProfileData) {
      return;
    }
    const getResumeUrl = async () => {
      const { data, error } = await supabase.storage.from("resumes").download(`${dbProfileData.id}.pdf`);
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } else if (!data) {
        // eslint-disable-next-line no-console
        console.error("No resume found");
      } else {
        setResumeUrl(URL.createObjectURL(data));
      }
    };
    getResumeUrl();
  }, [dbProfileData, supabase]);

  const profileData = useMemo(
    () => dbProfileData
    && avatarUrl
    && resumeUrl
    && ({ ...dbProfileData, avatarUrl, resumeUrl } as Profile),
    [dbProfileData, avatarUrl, resumeUrl],
  );

  if (!profileUsername || typeof profileUsername !== "string" || !profileData) {
    return null;
  }

  return (
    <div>
      {/* TODO: Edit avatar */}
      <ViewAvatar avatar={ profileData.avatarUrl } />

      <ViewProfile
        username={ profileUsername }
        profile={ profileData }
      />

      {/* TODO: Edit resume */}
      {resumeUrl && <ViewResume resume={ resumeUrl } />}

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
