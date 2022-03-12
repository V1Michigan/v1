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
    <div className="h-screen bg-black">
      <h3 className="text-lg font-large font-bold text-center leading-6 text-V1gold pl-6 pt-4">We can&apos;t wait to learn more about you!</h3>
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
          <div className="grid grid-cols-6 gap-6 pt-4">
            <div className="bg-white col-span-6 sm:col-start-2 col-end-6 center pt-2 mt-5 md:mt-0 rounded-md">
              <Form className="pr-8">
                <div className="sm:rounded-md px-4 py-5 bg-white space-y-2 sm:p-6">
                  <label htmlFor="roleTypes">Type(s) of role you&apos;re interested in:</label>
                  {Object.entries(RoleType).map(([key, value]) => (
                    <div key={ key }>
                      <Field
                        type="checkbox"
                        name="roleTypes"
                        className="m-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        id={ key }
                        value={ key }
                    />
                      <label htmlFor={ key }>{ value }</label>
                    </div>
                  ))}
                  <ErrorMessage name="roleTypes" component="p" className="text-red-500" />
                </div>
                <div className="grid grid-cols-6 gap-6">
                  <div className="pl-6 col-span-6 sm:col-span-3 w-2/3">
                    <MultiSelect
                      placeholder="Industries you&apos;re interested in"
                      name="interests"
                      options={ Object.entries(Interests).map(([k, v]) => ({ value: k, label: v })) }
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <div className="w-3/5 self-center">
                      <Dropzone
                        accept="application/pdf"
                        maxFiles={ 1 }
                        onDrop={ ([file]) => setFieldValue("resume", file) }
                    >
                        {({ getRootProps, getInputProps }) => (
                        /* eslint-disable react/jsx-props-no-spreading */
                          <div { ...getRootProps() } className="p-1 pl-2 block w-full cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-transparent text-sm rounded-lg">
                            <input { ...getInputProps() } />
                            <p className="text-sm font-medium text-gray-500 block ">
                              Please upload your resume (*.pdf)
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
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6 pt-4">
                  <div className="pl-6 col-span-6 sm:col-span-3">
                    <label htmlFor="linkedin">LinkedIn profile (optional)</label>
                    <Field
                      className="w-4/5 mt-1 self-center focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      type="text"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/billymagic" />
                    <ErrorMessage name="linkedin" component="p" className="text-red-500" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="additionalLinks">
                      Any other links you&apos;d like to share? (optional)
                    </label>
                    <Field
                      className="w-4/5 justify-self-center mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      type="text"
                      name="additionalLinks"
                      placeholder="E.g. personal site, Twitter, past projects..."
            />
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
