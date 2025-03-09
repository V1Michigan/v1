import type {
  PostgrestError,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import ReactGA from "react-ga4";
import Head from "../../components/Head";
import MemberBadges from "../../components/MemberBadges";
import NavbarBuilder from "../../components/NavBar";
import ProtectedRoute from "../../components/ProtectedRoute";
import EditProfile from "../../components/profile/EditProfile";
import ViewAvatar from "../../components/profile/ViewAvatar";
import ViewResume from "../../components/profile/ViewResume";
import {
  EditAvatar,
  EditResume,
} from "../../components/profile/fields/FileFields";
import { PartnerSharingConsentField } from "../../components/profile/fields/ProfileFields";
import { FieldOfStudy, Year } from "../../constants/profile";
import Rank from "../../constants/rank";
import useSupabase from "../../hooks/useSupabase";
import EmailIcon from "../../public/profile/email.svg";
import LinkedInIcon from "../../public/profile/linkedin.svg";
import isObjectEqual from "../../utils/isObjectEqual";

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
    document.body.classList.add("bg-gray-50");
    return () => {
      document.body.classList.remove("bg-gray-50");
    };
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
    <div className="min-h-screen bg-gray-50">
      <NavbarBuilder />
      <Formik
        enableReinitialize // to update when resetting initialProfile after submit
        initialValues={initialProfile}
        validate={() => setFormSubmitErrors([])}
        onSubmit={saveProfile}
      >
        {({ values, isSubmitting }) => (
          <div className="py-10">
            <Head title={profileUsername} />
            <Form>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  {/* Header Section with Avatar and Basic Info */}
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="relative">
                        {values.avatar ? (
                          <div className="relative">
                            <ViewAvatar avatar={values.avatar} />
                            {editMode && (
                              <div className="absolute -bottom-2 -right-2">
                                <EditAvatar />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                            {values.name
                              ? values.name.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {values.name}
                        </h1>
                        <p className="text-gray-600">@{profileUsername}</p>

                        {/* Social links */}
                        <div className="flex items-center justify-center md:justify-start space-x-4 mt-3">
                          <a
                            href={`mailto:${values.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <EmailIcon className="h-5 w-5 fill-current" />
                          </a>
                          {values.linkedin && (
                            <a
                              href={values.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <LinkedInIcon className="h-5 w-5 fill-current" />
                            </a>
                          )}
                          {values.website &&
                            /^https?:\/\//.test(values.website) && (
                              <a
                                href={values.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900"
                                aria-label="Visit website"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                                  />
                                </svg>
                              </a>
                            )}
                        </div>
                      </div>

                      {/* Edit button for small screens */}
                      <div className="mt-6 md:hidden w-full">
                        {!editMode && isCurrentUser && (
                          <button
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                      </div>

                      {/* Edit button for larger screens */}
                      <div className="hidden md:block md:ml-auto">
                        {!editMode && isCurrentUser && (
                          <button
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                              ReactGA.event({
                                category: "Profile",
                                action: "Entered edit mode",
                              });
                              setEditMode(true);
                            }}
                            type="button"
                          >
                            <svg
                              className="-ml-1 mr-2 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="px-6 py-6">
                    {/* Main content area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left column - Personal info */}
                      <div className="md:col-span-2">
                        {/* Bio section */}
                        <div className="mb-6">
                          <h2 className="text-lg font-medium text-gray-900 mb-2">
                            About
                          </h2>
                          <div className="prose max-w-none text-gray-700">
                            {editMode ? (
                              <EditProfile profile={values} />
                            ) : (
                              <>
                                {values.bio ? (
                                  <p>{values.bio}</p>
                                ) : (
                                  <p className="text-gray-400 italic">
                                    No bio provided
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Resume section - Only in edit mode */}
                        {editMode && (
                          <div className="mb-6 border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-2">
                              Resume
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                              {values.resume && (
                                <div className="col-span-1">
                                  <ViewResume resume={values.resume} />
                                </div>
                              )}
                              <div className="col-span-1">
                                <EditResume label="Upload your resume" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Partner sharing consent - Only in edit mode */}
                        {editMode && (
                          <div className="mb-6 border-t border-gray-200 pt-6">
                            <PartnerSharingConsentField />
                          </div>
                        )}
                      </div>

                      {/* Right column - Education & Skills */}
                      <div className="md:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          {/* Education info */}
                          <div className="mb-4">
                            <h2 className="text-lg font-medium text-gray-900 mb-2">
                              Education
                            </h2>
                            {values.year && (
                              <div className="mb-1 flex">
                                <span className="text-gray-500 w-20">
                                  Year:
                                </span>
                                <span className="text-gray-900">
                                  {Year[values.year]}
                                </span>
                              </div>
                            )}
                            {values.fields_of_study &&
                              values.fields_of_study.majors.length > 0 && (
                                <div className="mb-1 flex flex-wrap">
                                  <span className="text-gray-500 w-20">
                                    Major
                                    {values.fields_of_study.majors.length > 1
                                      ? "s"
                                      : ""}
                                    :
                                  </span>
                                  <span className="text-gray-900">
                                    {values.fields_of_study.majors
                                      .map((majorKey) => FieldOfStudy[majorKey])
                                      .join(", ")}
                                  </span>
                                </div>
                              )}
                            {values.fields_of_study &&
                              values.fields_of_study.minors &&
                              values.fields_of_study.minors.length > 0 && (
                                <div className="mb-1 flex flex-wrap">
                                  <span className="text-gray-500 w-20">
                                    Minor
                                    {values.fields_of_study.minors.length > 1
                                      ? "s"
                                      : ""}
                                    :
                                  </span>
                                  <span className="text-gray-900">
                                    {values.fields_of_study.minors
                                      .map((minorKey) => FieldOfStudy[minorKey])
                                      .join(", ")}
                                  </span>
                                </div>
                              )}
                          </div>

                          {/* Interests & roles */}
                          {(values.interests?.length > 0 ||
                            values.roles?.length > 0) && (
                            <div>
                              <h2 className="text-lg font-medium text-gray-900 mb-2">
                                Interests & Skills
                              </h2>
                              <div className="mt-2">
                                {values.interests && (
                                  <div className="pt-1">
                                    <MemberBadges
                                      roles={values.roles}
                                      interests={values.interests}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Messages */}
                  {(dataFetchErrors.length > 0 ||
                    formSubmitErrors.length > 0) && (
                    <div className="bg-red-50 px-6 py-4 border-t border-red-200">
                      {dataFetchErrors.map((error) => (
                        <p key={error} className="text-red-600 text-sm">
                          {error}
                        </p>
                      ))}
                      {formSubmitErrors.map((error) => (
                        <p key={error} className="text-red-600 text-sm">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Edit Mode Footer */}
                  {editMode && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                      <button
                        className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={
                          isSubmitting || isObjectEqual(values, initialProfile)
                        }
                        type="submit"
                      >
                        {isSubmitting ? "Saving..." : "Save Profile"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

const ProtectedProfile = () => (
  <ProtectedRoute minRank={Rank.INACTIVE_MEMBER}>
    <UserProfile />
  </ProtectedRoute>
);

export default ProtectedProfile;
