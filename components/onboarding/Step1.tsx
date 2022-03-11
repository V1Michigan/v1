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
  email, initialName, initialAvatarUrl, nextStep,
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
    <div>
      <p>Let&apos;s get to know you!</p>
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
          <Form className="flex flex-col w-1/2 gap-y-4">

            <NameField label="Name" />
            <EmailField value={ email } label="Email" />
            <UsernameField label="Username" />
            <PhoneField label="Phone" />

            <div>
              {values.avatar && <ViewAvatar avatar={ values.avatar } />}
              <EditAvatar />
            </div>

            <YearField label="School year" />
            <MajorsField label="Major(s)" />
            <MinorsField label="Minor(s) (optional)" />

            <button type="submit" disabled={ isSubmitting }>
              {isSubmitting ? "Loading..." : "Next ›"}
            </button>
            {submitError && <p className="text-red-500">{submitError}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Step1;
