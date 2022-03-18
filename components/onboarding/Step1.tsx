import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Header from "../Head";
import useSupabase from "../../hooks/useSupabase";
import getFileFromUrl from "../../utils/getFileFromUrl";
import {
  NameField,
  EmailField,
  UsernameField,
  PhoneField,
  RolesField,
  InterestsField,
  AdditionalLinksField,
} from "../profile/fields/ProfileFields";
import { FadeAllChildren } from "../Fade";
import ViewAvatar from "../profile/ViewAvatar";
import { EditAvatar } from "../profile/fields/FileFields";

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
  roles: string[],
  interests: string[],
  additionalLinks: string, // Optional
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
        const file = await getFileFromUrl(initialAvatarUrl, "Google profile picture");
        setInitialAvatar(file);
      }
    };
    fetchInitialAvatar();
  }, [initialAvatarUrl]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Header title="Sign Up | Welcome" />
      <div className="bg-gradient h-full">
        <h3 className="py-6 text-lg font-large text-center text-white font-bold">
          Let us get to know you better!
        </h3>
        <Formik
          enableReinitialize // to set avatar after fetching initialAvatarUrl
          initialValues={ {
            name: initialName || "",
            username: email?.split("@")[0] || "",
            avatar: initialAvatar, // may change after fetching
            phone: "",
            roles: [],
            interests: [],
            additionalLinks: "",
          } as FormValues }
          validate={ () => setSubmitError(null) }
        // Don't want to query DB for username on every keystroke, so just do onBlur
          validateOnChange={ false }
          onSubmit={ async (values, { setSubmitting }) => {
          // Upload avatar to bucket
          // values.avatar is not null, would've been caught by validation
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const avatarFile = (values.avatar as File);
            const { error: uploadError } = await supabase
              .storage.from("avatars").upload(
              // Just save as `user.id`, not including file extension
              // since we may have PNG, JPG, etc
                user.id, avatarFile, {
                  contentType: avatarFile.type,
                  cacheControl: "3600",
                  upsert: true,
                },
              );
            if (uploadError) {
              setSubmitError(uploadError.message);
              return;
            }

            const { error: dbError } = await supabase
              .from("profiles")
              .update({
                name: values.name,
                username: values.username,
                phone: values.phone,
                roles: values.roles,
                interests: values.interests,
                website: values.additionalLinks,
                updated_at: new Date(),
              }, {
                returning: "minimal", // Don't return the value after inserting
              })
              .eq("id", user.id);
            if (dbError) {
              setSubmitError(dbError.message);
            } else {
              setUsername(values.username);
              nextStep();
            }
            setSubmitting(false);
          } }
     >
          {({ values, isSubmitting }) => (
          // Need large pb-32 to prevent FadeAllChildren from overflowing
            <Form className="mx-auto w-4/5 px-16 py-8 pb-32 space-y-8 bg-white shadow-lg rounded-md">
              <FadeAllChildren>
                <NameField label="Name" />
                <EmailField value={ email } label="Email" />
                <UsernameField label="Username" />
                <PhoneField label="Phone" />

                <div>
                  {values.avatar && <ViewAvatar avatar={ values.avatar } />}
                  <div className="mx-auto w-1/2">
                    <EditAvatar />
                  </div>
                </div>

                <RolesField label="Which types of roles are you interested in?" />
                <InterestsField label="Which industries are you interested in?" />
                <AdditionalLinksField label="Any other links you'd like to share? (optional)" />

                <div>
                  <button
                    type="submit"
                    disabled={ isSubmitting }
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                    {isSubmitting ? "Loading..." : <>Submit &rsaquo;</>}
                  </button>
                  {submitError && (
                  <p className="text-red-500">{submitError}</p>
                  )}
                </div>
              </FadeAllChildren>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Step1;
