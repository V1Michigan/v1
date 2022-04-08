import { useState } from "react";
import { Formik, Form } from "formik";
import ReactGA from "react-ga4";
import Head from "../../Head";
import useSupabase from "../../../hooks/useSupabase";
import {
  BioField,
  LinkedInField,
  YearField,
  FieldsOfStudyFields,
  PartnerSharingConsentField,
} from "../fields/ProfileFields";
import ViewResume from "../ViewResume";
import Fade from "../../Fade";
import { EditResume } from "../fields/FileFields";
import InternalLink from "../../Link";

interface FormValues {
  bio: string;
  resume: File | null; // Optional
  linkedin: string; // Optional
  year: string;
  fields_of_study: {
    majors: string[];
    minors: string[];
  };
  partner_sharing_consent: boolean;
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
    <div className="h-full bg-gradient">
      <Head title="Complete profile" />
      <h3 className="py-2 md:py-6 text-lg font-large text-center text-white font-bold">
        We can&apos;t wait to learn more about you!
      </h3>
      <Formik
        initialValues={
          {
            bio: "",
            year: "",
            linkedin: "",
            resume: null,
            fields_of_study: {
              majors: [],
              minors: [],
            },
            partner_sharing_consent: true,
          } as FormValues
        }
        validate={() => setSubmitError(null)}
        onSubmit={async (values, { setSubmitting }) => {
          if (values.resume) {
            // Upload resume to bucket
            // TODO: This upload could be done in parallel with DB update
            const { error: uploadError } = await supabase.storage
              .from("resumes")
              .upload(user.id, values.resume, {
                contentType: "application/pdf",
                cacheControl: "3600",
                upsert: true,
              });
            if (uploadError) {
              setSubmitError(uploadError.message);
              return;
            }
          }

          const { error } = await supabase
            .from("profiles")
            .update(
              {
                bio: values.bio,
                year: values.year,
                fields_of_study: values.fields_of_study,
                linkedin: values.linkedin,
                partner_sharing_consent: values.partner_sharing_consent,
                updated_at: new Date(),
              },
              {
                returning: "minimal", // Don't return the value after inserting
              }
            )
            .eq("id", user.id);
          if (error) {
            setSubmitError(error.message);
          } else {
            ReactGA.event({
              category: "Onboarding",
              action: "Submitted Step 2 form",
            });
            nextStep();
          }
          setSubmitting(false);
        }}
      >
        {({ values, isSubmitting }) => (
          <Fade>
            <Form className="md:w-4/5 mx-2 md:mx-auto p-4 md:p-8 space-y-8 bg-white shadow-lg rounded-t-lg">
              <BioField label="Bio" />
              <YearField label="School year" />
              <FieldsOfStudyFields
                majorsLabel="Major(s)"
                minorsLabel="Minor(s) (optional)"
              />
              <LinkedInField label="LinkedIn profile (optional)" />

              <div className="mx-auto">
                {values.resume && <ViewResume resume={values.resume} />}
                <EditResume label="Upload your resume (optional)" />
              </div>

              <PartnerSharingConsentField />

              <div>
                <div className="flex justify-between items-center">
                  <InternalLink href="/dashboard">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-4 border border-black shadow text-sm font-medium rounded-md
                        text-black bg-white-600 hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white-600"
                    >
                      Back
                    </button>
                  </InternalLink>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow text-sm font-medium rounded-md
                      text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-indigo-600"
                  >
                    {isSubmitting ? "Loading..." : <>Submit &rsaquo;</>}
                  </button>
                </div>
                {submitError && <p className="text-red-500">{submitError}</p>}
              </div>
            </Form>
          </Fade>
        )}
      </Formik>
    </div>
  );
};

export default Step2;
