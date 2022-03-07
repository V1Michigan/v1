import { useState } from "react";
import {
  Formik, Form, FormikErrors,
} from "formik";
import useSupabase from "../../hooks/useSupabase";
import {
  RoleTypesField,
  InterestsField,
  LinkedInField,
  AdditionalLinksField,
} from "../profile/ProfileFields";
import ViewResume from "../profile/ViewResume";
import EditResume from "../profile/EditResume";

interface FormValues {
  roleTypes: string[],
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
          roleTypes: [],
          interests: [],
          resume: null,
          linkedin: "",
          additionalLinks: "",
        } as FormValues }
        validate={ (values) => {
          setSubmitError(null);
          const errors: FormikErrors<FormValues> = {};

          if (!values.resume) {
            errors.resume = "Please upload your resume";
          } else if (values.resume.type !== "application/pdf") {
            errors.resume = "Please upload a PDF resume";
          } else if (values.resume.size > 5 * 1024 * 1024) {
            errors.resume = "Please limit resume size to 5 MB";
          }

          return errors;
        } }
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
              roles: values.roleTypes,
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
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="flex flex-col w-1/2 gap-y-4">

            <RoleTypesField />
            <InterestsField />

            <div>
              {values.resume && <ViewResume resume={ values.resume } maxPages={ 1 } />}
              <EditResume value={ values.resume } onChange={ (resume: File) => setFieldValue("resume", resume) } />
            </div>

            <LinkedInField />
            <AdditionalLinksField />

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
