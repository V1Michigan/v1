import { useState } from "react";
import {
  Formik, Form, Field, ErrorMessage, FormikErrors,
} from "formik";
import useSupabase from "../../hooks/useSupabase";

type RoleType =
  | "Software Engineering"
  | "Data Science"
  | "UX/UI Design"
  | "Business"
  | "Growth"
  | "Product Management"

// TODO: better way to do this?
const ROLE_TYPES = [
  "Software Engineering",
  "Data Science",
  "UX/UI Design",
  "Business",
  "Growth",
  "Product Management",
] as RoleType[];

interface FormValues {
  roleTypes: RoleType[],
  // TODO: Industry?
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

          if (!values.resume) {
            errors.resume = "Please upload your resume";
          } else if (values.resume.type !== "application/pdf") {
            errors.resume = "Please upload a PDF resume";
          } else if (values.resume.size > 5 * 1024 * 1024) {
            errors.resume = "Please limit resume size to 5 MB";
          }

          // Note that LinkedIn is optional
          if (values.linkedin) {
            if (!/https:\/\/linkedin\.com\/in\/.{3,100}/.test(values.linkedin)) {
              errors.linkedin = (
                "Please enter a valid LinkedIn profile URL (e.g. https://www.linkedin.com/in/billymagic)"
              );
            }
          }

          // Note that additionalLinks is optional
          if (values.additionalLinks && values.additionalLinks.length > 500) {
            errors.additionalLinks = "Please limit additional links to 500 characters";
          }

          return errors;
        } }
        onSubmit={ async (values, { setSubmitting }) => {
          // TODO: Upload resume to bucket + get URL
          const { error } = await supabase
            .from("profiles")
            .update({
              linkedin: values.linkedin,
              // roles: values.roleTypes,  TODO: decide type for this column
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
        {({ setFieldValue, isSubmitting }) => (
          <Form className="flex flex-col w-1/2 gap-y-4">
            <div>
              <p id="role-type-group">Type(s) of role you&apos;re interested in:</p>
              <div role="group" aria-labelledby="role-type-group">
                {ROLE_TYPES.map((roleType) => (
                  <div key={ roleType }>
                    <label htmlFor={ roleType }>{ roleType }</label>
                    <Field
                      id={ roleType }
                      type="checkbox"
                      name="roleTypes"
                      value={ roleType }
                      className="m-2"
                  />
                  </div>
                ))}
              </div>
              <ErrorMessage name="roleTypes" component="p" className="text-red-500" />
            </div>

            <div>
              <p>Resume upload (*.pdf)</p>
              <input
                id="resume"
                name="resume"
                type="file"
                accept="application/pdf"
                multiple={ false }
                onChange={
                  (event) => event.currentTarget?.files && setFieldValue("resume", event.currentTarget.files[0])
                }
              />
              <ErrorMessage name="resume" component="p" className="text-red-500" />
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
