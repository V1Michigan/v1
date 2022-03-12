import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import type { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import ProtectedRoute from "../../components/ProtectedRoute";
import ViewProfile from "../../components/profile/ViewProfile";
import ViewResume from "../../components/profile/ViewResume";
import ViewAvatar from "../../components/profile/ViewAvatar";
import isObjectEqual from "../../utils/isObjectEqual";
import useSupabase from "../../hooks/useSupabase";
import EditProfile from "../../components/profile/EditProfile";
import { EditAvatar, EditResume } from "../../components/profile/fields/FileFields";

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
  // These two need to be fetched separately, after the DB query
  avatar?: File,
  resume?: File,
}
const PROFILE_COLUMNS = "id, email, name, phone, year, fields_of_study, linkedin, website, roles, interests";
type DBProfile = Omit<Profile, "minors" | "majors"> & {
  fields_of_study: {
    minors: string[];
    majors: string[];
  };
}

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { username: profileUsername } = router.query as {username: string};
  const { supabase, username: currentUsername } = useSupabase();
  const isCurrentUser = profileUsername === currentUsername;

  const [editMode, setEditMode] = useState(false);
  const [initialProfile, setInitialProfile] = useState<Profile | null>(null);

  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  const [formSubmitErrors, setFormSubmitErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setDataFetchErrors([]);
      const { data: dbData, error: dbError, status } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("username", profileUsername)
        .single() as PostgrestSingleResponse<DBProfile>;

      if ((dbError && status !== 406) || !dbData) {
        router.replace("/404");
      } else {
        const profile = { ...dbData, ...dbData.fields_of_study } as Omit<Profile, "avatar" | "resume">;
        // Show the profile data from the DB, then start fetching the avatar and resume
        setInitialProfile(profile);

        const [
          { data: avatar, error: avatarError }, { data: resume, error: resumeError },
        ] = await Promise.all([
          supabase.storage.from("avatars").download(profile.id),
          supabase.storage.from("resumes").download(`${profile.id}.pdf`),
        ]);

        setDataFetchErrors(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          ([avatarError, resumeError].filter(Boolean) as Error[]).map((error) => error.message),
        );
        setInitialProfile({
          ...profile,
          avatar: avatar ? new File([avatar as BlobPart], `${profileUsername} avatar`, { type: avatar.type }) : undefined,
          resume: resume ? new File([resume as BlobPart], `${profileUsername} Resume.pdf`, { type: "application/pdf" }) : undefined,
        });
      }
    };
    fetchProfileData();
  }, [supabase, profileUsername, router]);

  const saveProfile = async (profileData: Profile) => {
    if (!initialProfile || isObjectEqual(initialProfile, profileData)) {
      return;
    }
    setFormSubmitErrors([]);
    const {
      id, avatar, resume, ...profile
    } = profileData;
    const results = await Promise.all([
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
      (avatar && avatar !== initialProfile.avatar) && supabase.storage.from("avatars").upload(
        id, avatar, {
          contentType: avatar.type,
          cacheControl: "3600",
          upsert: true,
        },
      ),
      (resume && resume !== initialProfile.resume) && supabase.storage.from("resumes").upload(
        id, resume, {
          contentType: resume.type,
          cacheControl: "3600",
          upsert: true,
        },
      ),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const errors = results.map(
      (result) => result && result.error,
    ).filter(Boolean) as (Error | PostgrestError)[];
    if (errors.length > 0) {
      setFormSubmitErrors(errors.map(({ message }) => message));
    } else {
      setInitialProfile(profileData);
      setEditMode(false);
    }
  };

  if (!profileUsername || typeof profileUsername !== "string" || !initialProfile) {
    return null;
  }

  return (
    <Formik
      enableReinitialize // to update when resetting initialProfile after submit
      initialValues={ initialProfile }
      validate={ () => setFormSubmitErrors([]) }
      onSubmit={ saveProfile }
    >
      {({ values, isSubmitting }) => (
        <Form className="flex flex-col w-1/2 gap-y-4">

          {values.avatar && (
            <>
              <ViewAvatar avatar={ values.avatar } />
              {editMode && <EditAvatar />}
            </>
          )}

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

          {values.resume && (
            <>
              <ViewResume resume={ values.resume } />
              {editMode && <EditResume />}
            </>
          )}

          {dataFetchErrors.map((error) => (
            <p key={ error } className="text-red-500">{ error }</p>
          ))}

          {isCurrentUser && (
            <div className="mt-4">
              {editMode ? (
                <>
                  <button
                    className="button block"
                    disabled={ isSubmitting || isObjectEqual(values, initialProfile) }
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
                  {formSubmitErrors.map((error) => (
                    <p key={ error } className="text-red-500">{ error }</p>
                  ))}
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
