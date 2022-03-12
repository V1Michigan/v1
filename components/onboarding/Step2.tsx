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
    <div className="h-screen bg-black">
      <h3 className="text-lg font-large font-bold text-center leading-6 text-V1gold pl-6 pt-4">We can&apos;t wait to learn more about you!</h3>
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
          <div className="grid grid-cols-6 gap-6 pt-4">
            <div className="bg-white col-span-6 sm:col-start-2 col-end-6 center pt-2 mt-5 md:mt-0 rounded-md">
              <Form className="px-4">

                <div className="grid grid-cols-6 gap-6">
                  <div className="pl-6 col-span-6 sm:col-span-3 w-2/3">
                    <RolesField label="Which types of roles are you interested in?" />
                  </div>
                  <div className="pl-6 col-span-6 sm:col-span-3 w-2/3">
                    <InterestsField label="Which industries are you interested in?" />
                  </div>
                </div>

                <div className="pt-4 w-3/4 mx-auto">
                  {values.resume && <ViewResume resume={ values.resume } maxPages={ 1 } />}
                  <EditResume />
                </div>

                <div className="grid grid-cols-6 gap-6 pt-4">
                  <div className="pl-6 col-span-6 sm:col-span-3">
                    <LinkedInField label="LinkedIn profile (optional)" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <AdditionalLinksField label="Any other links you'd like to share? (optional)" />
                  </div>
                </div>
                <div className="pl-6 pt-4 pb-4">
                  <button
                    type="submit"
                    disabled={ isSubmitting }
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? "Loading..." : "Submit"}
                  </button>
                  {submitError && <p className="text-red-500">{submitError}</p>}
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default Step2;
