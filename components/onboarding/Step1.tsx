import { useState } from "react";
import {
  Formik, Form, Field, ErrorMessage, FormikErrors,
} from "formik";
import useSupabase from "../../hooks/useSupabase";

type Year =
  | "Freshman"
  | "Sophomore"
  | "Junior"
  | "Senior"
  | "Alumni"
  | "Grad student"
  | "Dropout"
  | "Faculty";

const YEARS = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Alumni",
  "Grad student",
  "Dropout",
  "Faculty",
] as Year[];

/* eslint-disable react/require-default-props */
interface Step1Props {
  email: string;
  initialName?: string;
  initialAvatarUrl?: string;
  nextStep: () => void;
}

interface FormValues {
  name: string;
  username: string;
  avatarUrl: string;
  year: Year | "";
  phone: string;
}

const Step1 = ({
  email, initialName, initialAvatarUrl, nextStep,
}: Step1Props) => {
  const { user, supabase } = useSupabase();
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Memo to avoid repeated queries
  const [openUsernames, setOpenUsernames] = useState<{[key: string]: boolean}>({});

  if (!user) {
    return null;
  }

  return (
    <div>
      <p>Let&apos;s get to know you!</p>
      <Formik
        initialValues={ {
          name: initialName || "",
          // TODO: Don't suggest username if it's already taken
          username: email?.split("@")[0] || "",
          avatarUrl: initialAvatarUrl || "",
          year: "",
          phone: "",
        } as FormValues }
        validate={ async (values) => {
          setSubmitError(null);
          const errors: FormikErrors<FormValues> = {};

          if (!values.name) {
            errors.name = "Please enter your name";
          } else if (values.name.length < 2 || values.name.length > 50) {
            errors.name = "Please enter a name between 2 and 50 characters";
          }

          if (!values.username) {
            errors.username = "Please select a username";
          } else if (values.username.length < 3 || values.username.length > 30) {
            errors.username = "Username must be between 3 and 30 characters";
          } else if (!/^[a-zA-Z\d]*$/.test(values.username)) {
            errors.username = "Usernames must only contain letters and numbers";
          } else if (openUsernames[values.username] === undefined) {
            const { count, error, status } = await supabase
              .from("profiles")
              .select("username", { count: "exact", head: true })
              .eq("username", values.username);
            if (error && status !== 406) {
              errors.username = error.message;
            } else {
              if (count) {
                errors.username = "Username is already taken";
              }
              setOpenUsernames(
                (openUsernames_) => ({ ...openUsernames_, [values.username]: !count }),
              );
            }
          } else if (!openUsernames[values.username]) {
            errors.username = "Username is already taken";
          }

          if (!values.avatarUrl) {
            errors.avatarUrl = "Please upload a profile picture";
          }

          if (!values.year) {
            errors.year = "Please select your year";
          }

          if (!values.phone) {
            errors.phone = "Please enter your phone number";
          } else if (!/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(values.phone)) {
            errors.phone = "Please enter a valid phone number";
          }

          return errors;
        } }
        // Don't want to query DB for username on every keystroke, so just do onBlur
        validateOnChange={ false }
        onSubmit={ async (values, { setSubmitting }) => {
          const { error } = await supabase
            .from("profiles")
            .update({
              name: values.name,
              username: values.username,
              avatar_url: values.avatarUrl,
              year: values.year,
              phone: values.phone,
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

            <div>
              <Field type="text" name="name" placeholder="Name" />
              <ErrorMessage name="name" component="p" className="text-red-500" />
            </div>

            <Field type="email" value={ email } disabled />

            <div>
              <Field type="text" name="username" placeholder="Username" />
              <ErrorMessage name="username" component="p" className="text-red-500" />
            </div>

            <div>
              {/* TODO: Placeholder for empty avatar */}
              {values.avatarUrl && (
              <img
                src={ values.avatarUrl }
                className="w-32 h-32 rounded-full m-2"
                alt="Profile"
                />
              )}
              <Field type="avatarUrl" name="avatarUrl" placeholder="Profile picture" />
              <ErrorMessage name="avatarUrl" component="p" className="text-red-500" />
            </div>

            <div>
              <Field as="select" name="year">
                {["", ...YEARS].map((year) => (
                  <option key={ year } value={ year }>{year}</option>
                ))}
              </Field>
              <ErrorMessage name="year" component="p" className="text-red-500" />
            </div>

            <div>
              <Field type="tel" name="phone" placeholder="Phone number (xxx-xxx-xxxx)" />
              <ErrorMessage name="phone" component="p" className="text-red-500" />
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

export default Step1;
