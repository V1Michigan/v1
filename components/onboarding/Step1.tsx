import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import useSupabase from "../../hooks/useSupabase";
import getFileFromUrl from "../../utils/getFileFromUrl";
import {
  NameField,
  EmailField,
  UsernameField,
  PhoneField,
  YearField,
  MajorsField,
  MinorsField,
} from "../profile/fields/ProfileFields";
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
  year: string;
  majors: string[];
  minors: string[];
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
    <div className="bg-black h-screen">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1 pl-8 pt-6">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-large leading-6 text-V1gold font-bold">
              Profile
            </h3>
            <p className="mt-1 text-m text-V1gold">
              Let us get to know you better!
            </p>
          </div>
        </div>
        <Formik
          enableReinitialize // to set avatar after fetching initialAvatarUrl
          initialValues={ {
            name: initialName || "",
            username: email?.split("@")[0] || "",
            avatar: initialAvatar, // may change after fetching
            year: "",
            phone: "",
            majors: [],
            minors: [],
          } as FormValues }
          validate={ () => setSubmitError(null) }
        // Don't want to query DB for username on every keystroke, so just do onBlur
          validateOnChange={ false }
          onSubmit={ async (values, { setSubmitting }) => {
          // Upload avatar to bucket
          // values.avatar is not null, would've been caught by validation
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
                year: values.year,
                fields_of_study: {
                  majors: values.majors,
                  minors: values.minors,
                },
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
            <div className="pt-6 mt-5 md:mt-0 md:col-start-2 col-end-4">
              <Form className="pr-8">
                <div className="shadow sm:rounded-md overflow-visible">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <NameField label="Name" />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <EmailField value={ email } label="Email" />
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <UsernameField label="Username" />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <PhoneField label="Phone" />
                      </div>
                    </div>

                    <div className="w-full">
                      {values.avatar && <ViewAvatar avatar={ values.avatar } />}
                      <EditAvatar />
                    </div>

                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">

                        <YearField label="School year" />
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3 overflow-x-visible">
                        <MajorsField label="Major(s)" />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <MinorsField label="Minor(s) (optional)" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={ isSubmitting }
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isSubmitting ? "Loading..." : "Next ›"}
                    </button>
                    {submitError && (
                      <p className="text-red-500">{submitError}</p>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Step1;
