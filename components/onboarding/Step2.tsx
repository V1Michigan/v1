import { useState } from "react";
import {
  Formik, Form, Field, ErrorMessage, FormikErrors,
} from "formik";
import Dropzone from "react-dropzone";
import useSupabase from "../../hooks/useSupabase";
import MultiSelect from "./MultiSelect";

enum RoleType {
  "eng" = "Engineering",
  "ds" = "Data Science",
  "des" = "UX/UI Design",
  "bus" = "Business",
  "gro" = "Growth",
  "pm" = "Product Management",
}

enum Interests {
  "sus" = "Sustainability",
  "fin" = "Fintech",
  "cr" = "Crypto",
  "tr" = "Transportation",
  "ai" = "Artificial Intelligence",
  "ec" = "E-commerce",
  "bio" = "Biotech",
  "edu" = "Education",
  "con" = "Consumer",
  "b2b" = "Business-to-business (B2B)",
}

interface FormValues {
  roleTypes: RoleType[],
  interests: Interests[],
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

          if (values.roleTypes.length === 0) {
            errors.roleTypes = "Please select at least one role";
          }

          if (values.interests.length === 0) {
            errors.interests = "Please select at least one of your interests";
          }

          if (!values.resume) {
            errors.resume = "Please upload your resume";
          } else if (values.resume.type !== "application/pdf") {
            errors.resume = "Please upload a PDF resume";
          } else if (values.resume.size > 5 * 1024 * 1024) {
            errors.resume = "Please limit resume size to 5 MB";
          }

          // Note that LinkedIn is optional
          if (values.linkedin && !/https:\/\/linkedin\.com\/in\/.{3,100}/.test(values.linkedin)) {
            errors.linkedin = (
              "Please enter a valid LinkedIn profile URL (e.g. https://www.linkedin.com/in/billymagic)"
            );
          }

          // Note that additionalLinks is optional
          if (values.additionalLinks && values.additionalLinks.length > 500) {
            errors.additionalLinks = "Please limit additional links to 500 characters";
          }

          return errors;
        } }
        onSubmit={ async (values, { setSubmitting }) => {
          // Upload resume to bucket
          const bucketPath = `${user.id}/resume.pdf`;
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
          const { publicURL: resumeUrl, error: urlError } = supabase
            .storage
            .from("resumes")
            .getPublicUrl(bucketPath);
          if (urlError) {
            setSubmitError(urlError.message);
            return;
          }

          const { error } = await supabase
            .from("profiles")
            .update({
              roles: values.roleTypes,
              interests: values.interests,
              resume_url: resumeUrl,
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
            <div>
              <p id="role-type-group">Type(s) of role you&apos;re interested in:</p>
              <div role="group" aria-labelledby="role-type-group">
                {Object.entries(RoleType).map(([key, value]) => (
                  <div key={ key }>
                    <Field
                      type="checkbox"
                      name="roleTypes"
                      className="m-1"
                      id={ key }
                      value={ key }
                    />
                    <label htmlFor={ key }>{ value }</label>
                  </div>
                ))}
              </div>
              <ErrorMessage name="roleTypes" component="p" className="text-red-500" />
            </div>

            <MultiSelect
              placeholder="Industries you&apos;re interested in"
              name="interests"
              options={ Object.entries(Interests).map(([k, v]) => ({ value: k, label: v })) }
            />

            <div>
              <Dropzone
                accept="application/pdf"
                maxFiles={ 1 }
                onDrop={ ([file]) => setFieldValue("resume", file) }
              >
                {({ getRootProps, getInputProps }) => (
                  /* eslint-disable react/jsx-props-no-spreading */
                  <div { ...getRootProps() } className="p-4 bg-gray-300 border-black border-2 rounded-lg">
                    <input { ...getInputProps() } />
                    <p>
                      Upload your resume (*.pdf)
                      {values.resume && (
                        <>
                          :
                          <b>
                            {" "}
                            {values.resume.name}
                          </b>
                        </>
                      )}
                    </p>
                    <ErrorMessage name="resume" component="p" className="text-red-500" />
                  </div>
                )}
              </Dropzone>
            </div>

            <div>
              <Field type="text" name="linkedin" placeholder="LinkedIn profile (optional)" />
              <ErrorMessage name="linkedin" component="p" className="text-red-500" />
            </div>

            <div>
              <p>Any other links you&apos;d like to share?</p>
              <Field
                type="text"
                name="additionalLinks"
                placeholder="E.g. personal site, Twitter, past projects..."
            />
            </div>

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
