import ReactGA from "react-ga4";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import type {
  PostgrestError,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import Head from "../../components/Head";
import ProtectedRoute from "../../components/ProtectedRoute";
import ViewProfile from "../../components/profile/ViewProfile";
import ViewResume from "../../components/profile/ViewResume";
import ViewAvatar from "../../components/profile/ViewAvatar";
import isObjectEqual from "../../utils/isObjectEqual";
import useSupabase from "../../hooks/useSupabase";
import EditProfile from "../../components/profile/EditProfile";
import {
  EditAvatar,
  EditResume,
} from "../../components/profile/fields/FileFields";
import { PartnerSharingConsentField } from "../../components/profile/fields/ProfileFields";
import Rank from "../../constants/rank";
import InternalLink from "../../components/Link";
import EmailIcon from "../../public/profile/email.svg";
import LinkedInIcon from "../../public/profile/linkedin.svg";

// Username included separately
export type Profile = {
  id: string;
  email: string;
  name: string;
  bio: string;
  phone?: string; // Not fetched if not current user
  // cohort: string;  For the future...
  year: string;
  fields_of_study: {
    minors: string[];
    majors: string[];
  };
  partner_sharing_consent: boolean;
  linkedin: string;
  website: string; // a.k.a "additional links"
  roles: string[];
  interests: string[];
  // These files need to be fetched separately, after the DB query
  avatar?: File;
  resume?: File; // Not fetched if not current user
};
const PROFILE_COLUMNS = (isCurrentUser: boolean) =>
  `id, email, name, bio, ${
    isCurrentUser ? "phone, " : ""
  }year, fields_of_study, linkedin, website, roles, interests, partner_sharing_consent`;

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { username: profileUsername } = router.query as { username: string };
  const { supabase, username: currentUsername } = useSupabase();
  const isCurrentUser = profileUsername === currentUsername;

  const [editMode, setEditMode] = useState(false);
  const [initialProfile, setInitialProfile] = useState<Profile | null>(null);

  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  const [formSubmitErrors, setFormSubmitErrors] = useState<string[]>([]);

  const downloadFromSupabase = useCallback(
    async (
      bucket: string,
      name: string,
      filename: string,
      filetype: string | undefined = undefined
    ) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(name);
      if (error) {
        if (
          bucket === "resumes" &&
          error.message === "The resource was not found"
        ) {
          // OK, resume is optional, don't show error
          return undefined;
        }
        setDataFetchErrors((errors) => [...errors, error.message]);
        return undefined;
      }
      if (!data) {
        setDataFetchErrors((errors) => [
          ...errors,
          `No data returned from ${bucket} bucket download`,
        ]);
        return undefined;
      }
      return new File([data as BlobPart], filename, {
        type: filetype || data.type,
      });
    },
    [supabase]
  );

  useEffect(() => {
    document.body.classList.add("bg-gray-800");
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      setDataFetchErrors([]);
      const {
        data: profile,
        error: dbError,
        status,
      } = (await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS(isCurrentUser))
        .eq("username", profileUsername)
        .single()) as PostgrestSingleResponse<
        Omit<Profile, "avatar" | "resume">
      >;

      if ((dbError && status !== 406) || !profile) {
        router.replace("/404");
      } else {
        // Show the profile data from the DB, then start fetching the avatar and resume
        setInitialProfile(profile);

        const [avatar, resume] = await Promise.all([
          downloadFromSupabase(
            "avatars",
            profile.id,
            `${profileUsername} avatar`
          ),
          // Don't fetch resume if not current user
          isCurrentUser
            ? await downloadFromSupabase(
                "resumes",
                profile.id,
                `${profileUsername} Resume.pdf`,
                "application/pdf"
              )
            : undefined,
        ]);
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
    const { id, avatar, resume, ...profile } = profileData;
    const results = await Promise.all([
      supabase
        .from("profiles")
        .update(
          {
            phone: profile.phone,
            linkedin: profile.linkedin,
            bio: profile.bio,
            website: profile.website,
            year: profile.year,
            fields_of_study: {
              majors: profile.fields_of_study.majors,
              minors: profile.fields_of_study.minors,
            },
            roles: profile.roles,
            interests: profile.interests,
            partner_sharing_consent: profile.partner_sharing_consent,
            updated_at: new Date(),
          },
          {
            returning: "minimal",
          }
        )
        .eq("id", id),
      avatar &&
        avatar !== initialProfile.avatar &&
        supabase.storage.from("avatars").upload(id, avatar, {
          contentType: avatar.type,
          cacheControl: "3600",
          upsert: true,
        }),
      resume &&
        resume !== initialProfile.resume &&
        supabase.storage.from("resumes").upload(id, resume, {
          contentType: resume.type,
          cacheControl: "3600",
          upsert: true,
        }),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const errors = results
      .map((result) => result && result.error)
      .filter(Boolean) as (Error | PostgrestError)[];
    if (errors.length > 0) {
      setFormSubmitErrors(errors.map(({ message }) => message));
    } else {
      setInitialProfile(profileData);
      setEditMode(false);
      ReactGA.event({
        category: "Profile",
        action: "Edited profile",
      });
    }
  };

  useEffect(() => {
    if (!isCurrentUser) {
      ReactGA.event({
        category: "Profile",
        action: "Viewed another user's profile",
      });
    }
  });

  if (
    !profileUsername ||
    typeof profileUsername !== "string" ||
    !initialProfile
  ) {
    return null;
  }

  return (
    <Formik
      enableReinitialize // to update when resetting initialProfile after submit
      initialValues={initialProfile}
      validate={() => setFormSubmitErrors([])}
      onSubmit={saveProfile}
    >
      {({ values, isSubmitting }) => (
        <div className="bg-gray-800 min-h-screen min-w-screen p-4 md:p-8 flex justify-center items-center text-white">
          <Head title={profileUsername} />
          <Form>
            {values.avatar && (
              <div className="flex flex-col md:flex-row justify-around items-center">
                <div className="m-4 mx-0 flex flex-row justify-between items-center">
                  <ViewAvatar avatar={values.avatar} />
                  <h2 className="text-2xl ml-4">
                    <b>{values.name}</b> ({profileUsername})
                    <div className="flex flex-row gap-x-5 p-0 py-2">
                      <InternalLink
                        href={`mailto:${values.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <EmailIcon className="h-6 w-6 fill-white" />
                      </InternalLink>
                      <InternalLink href={values.linkedin} target="_blank">
                        {values.linkedin && (
                          <LinkedInIcon className="h-6 w-6 fill-white" />
                        )}
                      </InternalLink>
                    </div>
                  </h2>
                </div>
                <div className="flex-1">{editMode && <EditAvatar />}</div>
              </div>
            )}

            {/* Not allowing name or username changes for now */}
            {/* <h2 className="text-2xl my-4">
              <b>{values.name}</b> ({profileUsername})
            </h2> */}
            {editMode ? (
              <EditProfile profile={values} />
            ) : (
              <ViewProfile profile={values} />
            )}

            {/* Don't want to show resume on public profile */}
            {editMode && (
              <div className="grid grid-cols-6 gap-6 pb-4 justify-center items-center pt-4">
                {values.resume && (
                  <div className="col-span-6 sm:col-span-3">
                    <ViewResume resume={values.resume} />
                  </div>
                )}
                <div className="col-span-6 sm:col-span-3">
                  <EditResume label="Upload your resume" />
                </div>
              </div>
            )}

            {editMode && <PartnerSharingConsentField />}

            {dataFetchErrors.map((error) => (
              <p key={error} className="text-red-500">
                {error}
              </p>
            ))}
            <div className="mt-8 flex justify-around items-center">
              {editMode ? (
                <>
                  <button
                    className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:bg-blue-500 hover:opacity-75 hover:shadow-lg text-gray-100 text-sm font-semibold py-2 px-4 transition duration-300 rounded shadow"
                    onClick={() => {
                      ReactGA.event({
                        category: "Profile",
                        action: "Exited edit mode",
                      });
                      setEditMode(false);
                    }}
                    disabled={isSubmitting}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:bg-blue-500 hover:opacity-75 hover:shadow-lg text-gray-100 text-sm font-semibold py-2 px-4 transition duration-300 rounded shadow"
                    disabled={
                      isSubmitting || isObjectEqual(values, initialProfile)
                    }
                    type="submit"
                  >
                    {isSubmitting ? "Saving..." : "Save Profile"}
                  </button>
                  {formSubmitErrors.map((error) => (
                    <p key={error} className="text-red-500">
                      {error}
                    </p>
                  ))}
                </>
              ) : (
                <>
                  <InternalLink href="/dashboard">
                    <button
                      className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:bg-blue-500 hover:opacity-75 hover:shadow-lg text-gray-100 text-sm font-semibold py-2 px-4 transition duration-300 rounded shadow"
                      type="button"
                    >
                      Back
                    </button>
                  </InternalLink>
                  {isCurrentUser && (
                    <button
                      className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:bg-blue-500 hover:opacity-75 hover:shadow-lg text-gray-100 text-sm font-semibold py-2 px-4 transition duration-300 rounded shadow"
                      onClick={() => {
                        ReactGA.event({
                          category: "Profile",
                          action: "Entered edit mode",
                        });
                        setEditMode(true);
                      }}
                      type="button"
                    >
                      Edit Profile
                    </button>
                  )}
                </>
              )}
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

const ProtectedProfile = () => (
  <ProtectedRoute minRank={Rank.INACTIVE_MEMBER}>
    <UserProfile />
  </ProtectedRoute>
);

export default ProtectedProfile;
