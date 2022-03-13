import { useState } from "react";
import { Formik, Form } from "formik";
import useSupabase from "../../hooks/useSupabase";
import {
  LinkedInField,
  YearField,
  MajorsField,
  MinorsField,
} from "../profile/fields/ProfileFields";
import ViewResume from "../profile/ViewResume";
import { FadeAllChildren } from "../Fade";
import { EditResume } from "../profile/fields/FileFields";

interface FormValues {
  resume: File | null,
  linkedin: string, // Optional
  year: string;
  majors: string[];
  minors: string[];
}

interface Step2Props {
  nextStep: () => void;
}

// TODO: Prompt user from dashboard to fill this out if they haven't yet
const Step2 = ({ nextStep }: Step2Props) => {
  const { user, supabase } = useSupabase();
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  return (
    <div className="h-full bg-black">
      <h3 className="py-6 text-lg font-large font-bold text-center text-V1gold">
        We can&apos;t wait to learn more about you!
      </h3>
      <Formik
        initialValues={ {
          resume: null,
          linkedin: "",
          year: "",
          majors: [],
          minors: [],
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
              // eslint-disable-next-line max-len
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
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
              year: values.year,
              fields_of_study: {
                majors: values.majors,
                minors: values.minors,
              },
              linkedin: values.linkedin,
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
          // Need large pb-32 to prevent FadeAllChildren from overflowing
          <Form className="mx-auto w-4/5 px-16 py-8 pb-32 space-y-8 bg-white shadow rounded-md">
            <FadeAllChildren>
              <YearField label="School year" />
              <LinkedInField label="LinkedIn profile (optional)" />

              <div className="pt-4 w-3/4 mx-auto">
                {values.resume && <ViewResume resume={ values.resume } maxPages={ 1 } />}
                <EditResume />
              </div>

              <MajorsField label="Major(s)" />
              <MinorsField label="Minor(s) (optional)" />

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
            </FadeAllChildren>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Step2;
