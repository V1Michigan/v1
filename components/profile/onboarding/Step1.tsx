import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import ReactGA from "react-ga4";
import Head from "../../Head";
import useSupabase from "../../../hooks/useSupabase";
import getFileFromUrl from "../../../utils/getFileFromUrl";
import {
  NameField,
  EmailField,
  UsernameField,
  PhoneField,
  RolesField,
  InterestsField,
  AdditionalLinksField,
} from "../fields/ProfileFields";
import Fade from "../../Fade";
import ViewAvatar from "../ViewAvatar";
import { EditAvatar } from "../fields/FileFields";

interface Step1Props {
  email: string;
  initialName?: string;
  initialAvatarUrl?: string;
  nextStep: () => void;
}

interface FormValues {
  name: string;
  username: string;
  phone: string;
  avatar: File | null;
  roles: string[];
  interests: string[];
  website: string; // Optional
}

const Step1 = ({
  email,
  initialName,
  initialAvatarUrl,
  nextStep,
}: Step1Props) => {
  const { user, setUsername, supabase } = useSupabase();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // If we have an initialAvatarUrl, fetch it and set it as the initial avatar
  const [initialAvatar, setInitialAvatar] = useState<File | null>(null);
  useEffect(() => {
    const fetchInitialAvatar = async () => {
      if (initialAvatarUrl) {
        const file = await getFileFromUrl(
          initialAvatarUrl,
          "Google profile picture"
        );
        setInitialAvatar(file);
      }
    };
    fetchInitialAvatar();
  }, [initialAvatarUrl]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient flex flex-col">
      <Head title="Welcome" />
      <h3 className="py-2 md:py-6 text-lg font-large text-center text-white font-bold">
        Let us get to know you better!
      </h3>
      <Formik
        enableReinitialize // to set avatar after fetching initialAvatarUrl
        initialValues={
          {
            name: initialName || "",
            username: email?.split("@")[0] || "",
            avatar: initialAvatar, // may change after fetching
            phone: "",
            roles: [],
            interests: [],
            website: "",
          } as FormValues
        }
        validate={() => setSubmitError(null)}
        // Don't want to query DB for username on every keystroke, so just do onBlur
        validateOnChange={false}
        onSubmit={async (values, { setSubmitting }) => {
          // Upload avatar to bucket
          // values.avatar is not null, would've been caught by validation
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const avatarFile = values.avatar as File;
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(
              // Just save as `user.id`, not including file extension
              // since we may have PNG, JPG, etc
              user.id,
              avatarFile,
              {
                contentType: avatarFile.type,
                cacheControl: "3600",
                upsert: true,
              }
            );
          if (uploadError) {
            setSubmitError(uploadError.message);
            return;
          }

          const { error: dbError } = await supabase
            .from("profiles")
            .update(
              {
                name: values.name,
                username: values.username,
                phone: values.phone,
                roles: values.roles,
                interests: values.interests,
                website: values.website,
                updated_at: new Date(),
              },
              {
                returning: "minimal", // Don't return the value after inserting
              }
            )
            .eq("id", user.id);
          if (dbError) {
            setSubmitError(dbError.message);
          } else {
            setUsername(values.username);
            ReactGA.event({
              category: "Onboarding",
              action: "Submitted Step 1 form",
            });
            nextStep();
          }
          setSubmitting(false);
        }}
      >
        {({ values, isSubmitting }) => (
          <Fade className="flex-1 flex flex-col">
            <Form className="md:w-4/5 mx-2 md:mx-auto p-4 md:p-8 bg-white shadow-lg rounded-t-lg flex-1 flex flex-col justify-between gap-y-4">
              <NameField label="Name" />
              <EmailField value={email} label="Email" />
              <UsernameField label="Username" />
              <PhoneField label="Phone" />
              <p className="text-xs text-gray-500 italic">
                You may receive texts for events you attend, such as V1 Startup
                Fair or V1 Connect
              </p>

              <div>
                {values.avatar && (
                  <div className="m-4 flex justify-center items-center">
                    <ViewAvatar avatar={values.avatar} />
                  </div>
                )}
                <div className="mx-auto">
                  <EditAvatar />
                </div>
              </div>

              <RolesField label="Which types of roles are you interested in?" />
              <InterestsField label="Which industries are you interested in?" />
              <AdditionalLinksField label="Any other links you'd like to share? (optional)" />

              <div className="flex justify-end items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow text-sm font-medium rounded-md
                    text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-indigo-600"
                >
                  {isSubmitting ? "Loading..." : <>Submit &rsaquo;</>}
                </button>
                {submitError && <p className="text-red-500">{submitError}</p>}
              </div>
            </Form>
          </Fade>
        )}
      </Formik>
    </div>
  );
};

export default Step1;
