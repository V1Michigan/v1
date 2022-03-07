import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Formik, Form, FormikErrors } from "formik";
import ProtectedRoute from "../../components/ProtectedRoute";
import ViewProfile from "../../components/profile/ViewProfile";
import ViewResume from "../../components/profile/ViewResume";
import ViewAvatar from "../../components/profile/ViewAvatar";
import isObjectEqual from "../../utils/isObjectEqual";
import useSupabase from "../../hooks/useSupabase";
import EditProfile from "../../components/profile/EditProfile";

// Username included separately
export type Profile = {
  id: string;
  email: string;
  name: string;
  phone: string; // Not sure this should be public
  // cohort: string;  For the future...
  year: string,
  majors: string[],
  // These two are stored together in the DB as a single JSON field
  minors: string[],
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

  const [editMode, setEditMode] = useState(true);

  const [initialProfile, setInitialProfile] = useState<Profile | null>(null);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const profileHasChanges = useMemo(
    () => initialProfile && profileData && !isObjectEqual(initialProfile, profileData),
    [initialProfile, profileData],
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: data_, error, status } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("username", profileUsername)
        .single();
      const data = { ...data_, ...data_.fields_of_study } as Omit<Profile, "avatar" | "resume">;

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

        const newProfileData = {
          ...data,
          avatar: new File([avatar as BlobPart], "avatar"),
          resume: new File([resume as BlobPart], `${profileUsername} Resume.pdf`),
        };
        setInitialProfile(newProfileData);
        setProfileData(newProfileData);
      }
    };
    fetchProfileData();
  }, [supabase, profileUsername, router]);

  const saveProfile = () => {
    if (!profileHasChanges) {
      return;
    }
    setInitialProfile(profileData);
    setEditMode(false);
  };

  if (!profileUsername || typeof profileUsername !== "string" || !initialProfile || !profileData) {
    return null;
  }

  return (
    <Formik
      enableReinitialize // to set avatar after fetching initialAvatarUrl
      initialValues={ initialProfile }
      validate={ undefined }
      onSubmit={ saveProfile }
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col w-1/2 gap-y-4">
          {/* TODO: Edit avatar */}
          <ViewAvatar avatar={ profileData.avatar } />

          {editMode
            ? <EditProfile profile={ profileData } />
            : <ViewProfile profile={ profileData } />}

          {/* TODO: Edit resume */}
          {profileData.resume && <ViewResume resume={ profileData.resume } />}

          {isCurrentUser && (
            <div className="mt-4">
              {editMode ? (
                <>
                  <button
                    className="button block"
                    onClick={ saveProfile }
                    disabled={ !profileHasChanges || isSubmitting }
                    type="button"
                  >
                    Save Profile
                  </button>
                  <button
                    className="button block"
                    onClick={ () => setEditMode(false) }
                    disabled={ isSubmitting }
                    type="button"
                  >
                    Cancel
                  </button>
                </>
              )
                : (
                  <button
                    className="button block"
                    onClick={ () => setEditMode(true) }
                    type="button"
                   >
                    Edit Profile
                  </button>
                )}
            </div>
          )}
          <div className="mt-4">
            <button
              className="button block"
              onClick={ () => supabase.auth.signOut() }
              type="button"
            >
              Sign Out
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default () => (
  <ProtectedRoute>
    <UserProfile />
  </ProtectedRoute>
);
