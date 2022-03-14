import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
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
  phone?: string; // Not fetched if not current user
  // cohort: string;  For the future...
  year: string,
  // These two are stored together in the DB as a single JSON field
  majors: string[],
  minors: string[],
  linkedin: string,
  website: string,
  roles: string[],
  interests: string[],
  // These two need to be fetched separately, after the DB query
  avatar?: File,
  resume?: File, // Not fetched if not current user
}
const PROFILE_COLUMNS = (isCurrentUser: boolean) => `id, email, name, ${isCurrentUser ? "phone, " : ""}year, fields_of_study, linkedin, website, roles, interests`;
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

  const [editMode, setEditMode] = useState(true);
  const [initialProfile, setInitialProfile] = useState<Profile | null>(null);

  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  const [formSubmitErrors, setFormSubmitErrors] = useState<string[]>([]);

  const downloadFromSupabase = useCallback(async (
    bucket: string,
    name: string,
    filename: string,
    filetype: string | undefined = undefined,
  ) => {
    const { data, error } = await supabase.storage.from(bucket).download(name);
    if (error) {
      setDataFetchErrors((errors) => [...errors, error.message]);
      return undefined;
    } if (!data) {
      setDataFetchErrors((errors) => [...errors, `No data returned from ${bucket} bucket download`]);
      return undefined;
    }
    return new File([data as BlobPart], filename, { type: filetype || data.type });
  }, [supabase]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setDataFetchErrors([]);
      const { data: dbData, error: dbError, status } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS(isCurrentUser))
        .eq("username", profileUsername)
        .single() as PostgrestSingleResponse<DBProfile>;

      if ((dbError && status !== 406) || !dbData) {
        router.replace("/404");
      } else {
        const profile = { ...dbData, ...dbData.fields_of_study } as Omit<Profile, "avatar" | "resume">;
        // Show the profile data from the DB, then start fetching the avatar and resume
        setInitialProfile(profile);

        const [avatar, resume] = await Promise.all([
          downloadFromSupabase(
            "avatars", profile.id, `${profileUsername} avatar`,
          ),
          // Don't fetch resume if not current user
          isCurrentUser ? await downloadFromSupabase(
            "resumes", `${profile.id}.pdf`, `${profileUsername} Resume.pdf`, "application/pdf",
          ) : undefined]);
        setInitialProfile({
          ...profile,
          avatar,
          resume,
        });
      }
    };
    fetchProfileData();
  }, [supabase, profileUsername, router, downloadFromSupabase, isCurrentUser]);

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
        <div className="bg-gradient min-h-screen min-w-screen p-10 flex justify-center items-center text-white">
          <Form>

            {values.avatar && (
              <div className="grid grid-cols-8 pb-4 items-center">
                <div className="col-span-8x sm:col-span-4 pl-20">
                  <div className="pl-8">
                    <ViewAvatar avatar={ values.avatar } />
                  </div>
                </div>
                <div className="col-span-8x sm:col-span-4 pl-6">
                  {editMode && <EditAvatar />}
                </div>
              </div>
            )}

            {/* Not allowing name or username changes for now */}
            <h2 className="text-2xl my-4">
              <b>{values.name}</b>
              {" "}
              (
              {profileUsername}
              )
            </h2>
            {editMode
              ? <EditProfile profile={ values } />
              : <ViewProfile profile={ values } />}

            {/* Don't want to show resume on public profile */}
            {editMode && values.resume && (
            <>
              <div className="grid grid-cols-6 gap-6 pb-4 items-center justify-center items-center pt-4">
                <div className="col-span-6 sm:col-span-3">
                  <ViewResume resume={ values.resume } />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <EditResume />
                </div>
              </div>
            </>
            )}

            {dataFetchErrors.map((error) => (
              <p key={ error } className="text-red-500">{ error }</p>
            ))}
            <div className="mt-4 grid grid-cols-6 gap-6">
              {isCurrentUser && (
              <div className="mx-auto col-span-6 sm:col-span-3">
                {editMode ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 pl-10">
                      <button
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={ isSubmitting || isObjectEqual(values, initialProfile) }
                        type="submit"
                      >
                        {isSubmitting ? "Saving..." : "Save Profile"}
                      </button>
                      <button
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={ () => setEditMode(false) }
                        disabled={ isSubmitting }
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                    {formSubmitErrors.map((error) => (
                      <p key={ error } className="text-red-500">{ error }</p>
                    ))}
                  </>
                )
                  : (
                    <button
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={ () => setEditMode(true) }
                      type="button"
                   >
                      Edit Profile
                    </button>
                  )}
              </div>
              )}
              <div className="mx-auto col-span-6 sm:col-span-3">
                <button
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={ () => supabase.auth.signOut() }
                  type="button"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default () => (
  <ProtectedRoute minRank={ 1 }>
    <UserProfile />
  </ProtectedRoute>
);
