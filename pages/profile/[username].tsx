import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import ProtectedRoute from "../../components/ProtectedRoute";
import ViewProfile from "../../components/profile/ViewProfile";
import ViewResume from "../../components/profile/ViewResume";
import ViewAvatar from "../../components/profile/ViewAvatar";
import isObjectEqual from "../../utils/isObjectEqual";
import useSupabase from "../../hooks/useSupabase";
import EditProfile from "../../components/profile/EditProfile";
import EditAvatar from "../../components/profile/EditAvatar";
import EditResume from "../../components/profile/EditResume";

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

  const [editMode, setEditMode] = useState(false);
  const [initialProfile, setInitialProfile] = useState<Profile | null>(null);

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
      }
    };
    fetchProfileData();
  }, [supabase, profileUsername, router]);

  if (!profileUsername || typeof profileUsername !== "string" || !initialProfile) {
    return null;
  }

  const saveProfile = async (profileData_: Profile) => {
    if (isObjectEqual(initialProfile, profileData_)) {
      return;
    }
    const {
      id, avatar, resume, ...profile
    } = profileData_;
    // TODO: handle errors
    await Promise.all([
      supabase
        .from("profiles")
        .update({
          phone: profile.phone,
          linkedin: profile.linkedin,
          website: profile.website,
          year: profile.year,
          fields_of_study: {
            majors: profile.majors,
            minors: profile.minors,
          },
          roles: profile.roles,
          interests: profile.interests,
          updated_at: new Date(),
        }, {
          returning: "minimal",
        })
        .eq("id", id),
      (avatar !== initialProfile.avatar) && supabase.storage.from("avatars").upload(
        id, avatar, {
          contentType: avatar.type,
          cacheControl: "3600",
          upsert: true,
        },
      ),
      (resume !== initialProfile.resume) && supabase.storage.from("resumes").upload(
        id, resume, {
          contentType: resume.type,
          cacheControl: "3600",
          upsert: true,
        },
      ),
    ].filter(Boolean));
    setInitialProfile(profileData_);
    setEditMode(false);
  };

  return (
    <Formik
      enableReinitialize // to update when resetting initialProfile after submit
      initialValues={ initialProfile }
      validate={ undefined }
      onSubmit={ saveProfile }
    >
      {({ values, isSubmitting }) => (
        <Form className="flex flex-col w-1/2 gap-y-4">

          <ViewAvatar avatar={ values.avatar } />
          {editMode && <EditAvatar />}

          {/* Not allowing name or username changes for now */}
          <h2 className="text-2xl">
            <span className="font-bold">{values.name}</span>
            {" "}
            (
            {profileUsername}
            )
          </h2>
          {editMode
            ? <EditProfile profile={ values } />
            : <ViewProfile profile={ values } />}

          {values.resume && <ViewResume resume={ values.resume } />}
          {editMode && <EditResume />}

          {isCurrentUser && (
            <div className="mt-4">
              {editMode ? (
                <>
                  <button
                    className="button block"
                    disabled={ isObjectEqual(values, initialProfile) || isSubmitting }
                    type="submit"
                  >
                    {isSubmitting ? "Saving..." : "Save Profile"}
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
