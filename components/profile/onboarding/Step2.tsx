import { useState } from "react";
import { Formik, Form } from "formik";
import ReactGA from "react-ga4";
import useSupabase from "../../../hooks/useSupabase";
import {
  BioField,
  LinkedInField,
  YearField,
  MajorsField,
  MinorsField,
  PartnerSharingConsentField,
} from "../fields/ProfileFields";
import ViewResume from "../ViewResume";
import { FadeAllChildren } from "../../Fade";
import { EditResume } from "../fields/FileFields";

interface FormValues {
  bio: string;
  resume: File | null; // Optional
  linkedin: string; // Optional
  year: string;
  majors: string[];
  minors: string[];
  partnerSharingConsent: boolean;
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
      <h3 className="py-6 text-lg font-large font-bold text-center text-white">
        We can&apos;t wait to learn more about you!
      </h3>
      <Formik
        initialValues={
          {
            bio: "",
            year: "",
            linkedin: "",
            resume: null,
            majors: [],
            minors: [],
            partnerSharingConsent: true,
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
                fields_of_study: {
                  majors: values.majors,
                  minors: values.minors,
                },
                linkedin: values.linkedin,
                partner_sharing_consent: values.partnerSharingConsent,
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
          // Need large pb-32 to prevent FadeAllChildren from overflowing
          <Form className="mx-auto w-4/5 px-16 py-8 pb-32 space-y-8 bg-white shadow-lg rounded-md">
            <FadeAllChildren>
              <BioField label="Bio" />
              <YearField label="School year" />
              <LinkedInField label="LinkedIn profile (optional)" />

              <div className="pt-4 mx-auto w-1/2">
                {values.resume && <ViewResume resume={values.resume} />}
                <EditResume label="Upload your resume (optional)" />
              </div>

              <MajorsField label="Major(s)" />
              <MinorsField label="Minor(s) (optional)" />
              <PartnerSharingConsentField />

              <div className="pl-6 pt-4 pb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
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
