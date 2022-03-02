import { useState } from "react";
import {
  Formik, Form, Field, ErrorMessage, FormikErrors,
} from "formik";
import Dropzone from "react-dropzone";
import MultiSelect from "./MultiSelect";
import useSupabase from "../../hooks/useSupabase";
import getFileFromUrl from "../../utils/getFileFromUrl";
import _FIELDS_OF_STUDY from "./fieldsOfStudy";
import type { FieldOfStudy } from "./fieldsOfStudy";

const FIELDS_OF_STUDY = _FIELDS_OF_STUDY.map((field) => ({ label: field, value: field }));

// Use string enum so we don't get numbers from Object.keys()
enum Year {
  "Freshman" = "Freshman",
  "Sophomore" = "Sophomore",
  "Junior" = "Junior",
  "Senior" = "Senior",
  "Alumni" = "Alumni",
  "Grad student" = "Grad student",
  "Dropout" = "Dropout",
  "Faculty" = "Faculty",
}

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
  phone: string;
  avatar: string | File;
  year: Year | "";
  majors: FieldOfStudy[];
  minors: FieldOfStudy[];
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
          avatar: initialAvatarUrl || "",
          year: "",
          phone: "",
          majors: [],
          minors: [],
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

          if (!values.phone) {
            errors.phone = "Please enter your phone number";
          } else if (!/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(values.phone)) {
            errors.phone = "Please enter a valid phone number";
          }

          if (!values.avatar) {
            errors.avatar = "Please upload a profile picture";
          }

          if (!values.year) {
            errors.year = "Please select your year";
          }

          if (values.majors.length === 0) {
            errors.majors = "Please select at least one major, or 'Undecided'";
          }

          return errors;
        } }
        // Don't want to query DB for username on every keystroke, so just do onBlur
        validateOnChange={ false }
        onSubmit={ async (values, { setSubmitting }) => {
          // Fetch avatar if it's still the initial URL
          const avatarFile = values.avatar instanceof File
            ? values.avatar
            : await getFileFromUrl(values.avatar, "avatar");
          const bucketPath = `${user.id}/avatar.${avatarFile.type.split("/")[1]}`;

          // Upload avatar to bucket
          const { error: uploadError } = await supabase
            .storage.from("avatars").upload(
              bucketPath, avatarFile, {
                contentType: avatarFile.type,
                cacheControl: "3600",
                upsert: true,
              },
            );
          if (uploadError) {
            setSubmitError(uploadError.message);
            return;
          }
          const { publicURL: avatarUrl, error: urlError } = supabase
            .storage
            .from("avatars")
            .getPublicUrl(bucketPath);
          if (urlError) {
            setSubmitError(urlError.message);
            return;
          }

          const { error: dbError } = await supabase
            .from("profiles")
            .update({
              name: values.name,
              username: values.username,
              phone: values.phone,
              avatar_url: avatarUrl,
              year: values.year,
              fields_of_study: {
                majors: values.majors,
                minors: values.minors,
              },
              updated_at: new Date(),
            }, {
              returning: "minimal", // Don't return the value after inserting
            })
            .eq("id", user.id);
          if (dbError) {
            setSubmitError(dbError.message);
          } else {
            nextStep();
          }
          setSubmitting(false);
        } }
     >
        {({ values, setFieldValue, isSubmitting }) => (
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
              <Field type="tel" name="phone" placeholder="Phone number (xxx-xxx-xxxx)" />
              <ErrorMessage name="phone" component="p" className="text-red-500" />
            </div>

            <div>
              {values.avatar && (
                <img
                  src={ typeof values.avatar === "string" ? values.avatar : URL.createObjectURL(values.avatar) }
                  className="w-32 h-32 rounded-full m-2 border-black border-2"
                  alt="Profile"
                />
              )}
              <Dropzone
                accept="image/jpeg, image/png, image/gif"
                maxFiles={ 1 }
                onDrop={ ([file]) => setFieldValue("avatar", file) }
              >
                {({ getRootProps, getInputProps }) => (
                  /* eslint-disable react/jsx-props-no-spreading */
                  <div { ...getRootProps() } className="p-4 bg-gray-300 border-black border-2 rounded-lg">
                    <input { ...getInputProps() } />
                    <p>
                      Select a profile picture (*.jpeg, *.png, *.gif)
                      {values.avatar instanceof File && (
                        <>
                          :
                          <b>
                            {" "}
                            {values.avatar.name}
                          </b>
                        </>
                      )}
                    </p>
                    <ErrorMessage name="avatar" component="p" className="text-red-500" />
                  </div>
                )}
              </Dropzone>
            </div>

            <div>
              <Field as="select" name="year">
                <option value="" disabled hidden>
                  Select your year
                </option>
                {Object.keys(Year).map((year) => (
                  <option key={ year } value={ year }>{year}</option>
                ))}
              </Field>
              <ErrorMessage name="year" component="p" className="text-red-500" />
            </div>

            <MultiSelect
              name="majors"
              options={ FIELDS_OF_STUDY }
              placeholder="Select your major(s)"
            />

            {/* List of minors might be slightly different...probably fine for now */}
            <MultiSelect
              name="minors"
              options={ FIELDS_OF_STUDY }
              placeholder="Select your minors(s) (optional)"
            />

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
