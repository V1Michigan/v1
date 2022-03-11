import { useState } from "react";
import { Formik, Form } from "formik";
import useSupabase from "../../hooks/useSupabase";
import {
  RolesField,
  InterestsField,
  LinkedInField,
  AdditionalLinksField,
} from "../profile/fields/ProfileFields";
import ViewResume from "../profile/ViewResume";
import { EditResume } from "../profile/fields/FileFields";

interface FormValues {
  roles: string[],
  interests: string[],
  resume: File | null,
  linkedin: string, // Optional
  additionalLinks: string, // Optional
}

interface Step2Props {
  nextStep: () => void;
}

const Step2 = ({ nextStep }: Step2Props) => {
  const { user, supabase } = useSupabase();
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  return (
    <div>
      <p>We can&apos;t wait to learn more about you</p>
      <Formik
        initialValues={ {
          roles: [],
          interests: [],
          resume: null,
          linkedin: "",
          additionalLinks: "",
        } as FormValues }
        validate={ () => setSubmitError(null) }
        onSubmit={ async (values, { setSubmitting }) => {
          // Upload resume to bucket
          // TODO: For consistency with avatars, consider not using file extension
          const bucketPath = `${user.id}.pdf`;
          const { error: uploadError } = await supabase
            .storage.from("resumes").upload(
              bucketPath,
              // values.resume is not null, would've been caught by validation
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              values.resume!,
              {
                contentType: "application/pdf",
                cacheControl: "3600",
                upsert: true,
              },
            );
          if (uploadError) {
            setSubmitError(uploadError.message);
            return;
          }

          const { error } = await supabase
            .from("profiles")
            .update({
              roles: values.roles,
              interests: values.interests,
              linkedin: values.linkedin,
              website: values.additionalLinks,
              updated_at: new Date(),
            }, {
              returning: "minimal", // Don't return the value after inserting
            })
            .eq("id", user.id);
          if (error) {
            setSubmitError(error.message);
          } else {
            nextStep();
          }
          setSubmitting(false);
        } }
     >
        {({ values, isSubmitting }) => (
          <Form className="flex flex-col w-1/2 gap-y-4">

            <RolesField label="Which types of roles are you interested in?" />
            <InterestsField label="Which industries are you interested in?" />

            <div>
              {values.resume && <ViewResume resume={ values.resume } maxPages={ 1 } />}
              <EditResume />
            </div>

            <LinkedInField label="LinkedIn profile (optional)" />
            <AdditionalLinksField label="Any other links you'd like to share? (optional)" />

            <button type="submit" disabled={ isSubmitting }>
              {isSubmitting ? "Loading..." : "Submit"}
            </button>
            {submitError && <p className="text-red-500">{submitError}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Step2;
