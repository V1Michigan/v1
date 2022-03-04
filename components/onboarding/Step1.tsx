import { useEffect, useState } from "react";
import {
  Formik, Form, Field, ErrorMessage, FormikErrors,
} from "formik";
import Dropzone from "react-dropzone";
import MultiSelect from "./MultiSelect";
import useSupabase from "../../hooks/useSupabase";
import getFileFromUrl from "../../utils/getFileFromUrl";
import _FIELDS_OF_STUDY from "./fieldsOfStudy";
import type { FieldOfStudy } from "./fieldsOfStudy";

const FIELDS_OF_STUDY = _FIELDS_OF_STUDY.map((field) => ({
  label: field,
  value: field,
}));

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
  avatar: File | null;
  year: Year | "";
  majors: FieldOfStudy[];
  minors: FieldOfStudy[];
}

const Step1 = ({
  email,
  initialName,
  initialAvatarUrl,
  nextStep,
}: Step1Props) => {
  const { user, supabase } = useSupabase();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // If we have an initialAvatarUrl, fetch it and set it as the initial avatar
  const [initialAvatar, setInitialAvatar] = useState<File | null>(null);
  useEffect(() => {
    const fetchInitialAvatar = async () => {
      if (initialAvatarUrl) {
        const file = await getFileFromUrl(initialAvatarUrl, "avatar");
        setInitialAvatar(file);
      }
    };
    fetchInitialAvatar();
  }, [initialAvatarUrl]);

  // Memo to avoid repeated queries
  const [openUsernames, setOpenUsernames] = useState<{
    [key: string]: boolean;
  }>({});

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1 pl-8 pt-6">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-large leading-6 text-gray-900">
              Profile
            </h3>
            <p className="mt-1 text-m text-gray-600">
              Let us get to know you better!
            </p>
          </div>
        </div>
        <Formik
          enableReinitialize // to set avatar after fetching initialAvatarUrl
          initialValues={
            {
              name: initialName || "",
              username: email?.split("@")[0] || "",
              avatar: initialAvatar, // may change after fetching
              year: "",
              phone: "",
              majors: [],
              minors: [],
            } as FormValues
          }
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
            } else if (
              values.username.length < 3
              || values.username.length > 30
            ) {
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
                setOpenUsernames((openUsernames_) => ({
                  ...openUsernames_,
                  [values.username]: !count,
                }));
              }
            } else if (!openUsernames[values.username]) {
              errors.username = "Username is already taken";
            }

            if (!values.phone) {
              errors.phone = "Please enter your phone number";
            } else if (
              !/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(
                values.phone,
              )
            ) {
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
            // Upload avatar to bucket
            // values.avatar is not null, would've been caught by validation
            const avatarFile = values.avatar as File;
            const { error: uploadError } = await supabase.storage
              .from("avatars")
              .upload(
                // Not including file extension since we may have PNG, JPG, etc
                user.id,
                avatarFile,
                {
                  contentType: avatarFile.type,
                  cacheControl: "3600",
                  upsert: true,
                },
              );
            if (uploadError) {
              setSubmitError(uploadError.message);
              return;
            }

            const { error: dbError } = await supabase
              .from("profiles")
              .update(
                {
                  name: values.name,
                  username: values.username,
                  phone: values.phone,
                  year: values.year,
                  fields_of_study: {
                    majors: values.majors,
                    minors: values.minors,
                  },
                  updated_at: new Date(),
                },
                {
                  returning: "minimal", // Don't return the value after inserting
                },
              )
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
            <div className="pt-2 mt-5 md:mt-0 md:col-start-2 col-end-4">
              <Form className="pr-8">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="name" className="block">
                          Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <Field
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <ErrorMessage
                          name="name"
                          component="p"
                          className="text-red-500"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="email" className="block">
                          Email
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <Field
                            type="email"
                            value={ email }
                            disabled
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="username" className="block">
                          Username
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <Field
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <ErrorMessage
                          name="username"
                          component="p"
                          className="text-red-500"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="phone" className="block">
                          Phone Number
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <Field
                            type="tel"
                            name="phone"
                            placeholder="xxx-xxx-xxxx"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <ErrorMessage
                          name="phone"
                          component="p"
                          className="text-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      {values.avatar && (
                        <img
                          src={ URL.createObjectURL(values.avatar) }
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
                          <div
                            { ...getRootProps() }
                            className="p-4 bg-gray-300 border-black border-2 rounded-lg"
                          >
                            <input { ...getInputProps() } />
                            <p>
                              Select a profile picture (*.jpeg, *.png, *.gif)
                              {values.avatar && (
                                <>
                                  :
                                  <b>
                                    {" "}
                                    {values.avatar.name}
                                  </b>
                                </>
                              )}
                            </p>
                            <ErrorMessage
                              name="avatar"
                              component="p"
                              className="text-red-500"
                            />
                          </div>
                        )}
                      </Dropzone>
                    </div>

                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="year" className="block">
                          School year
                        </label>
                        <Field
                          as="select"
                          name="year"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="" disabled hidden>
                            Select your year
                          </option>
                          {Object.keys(Year).map((year) => (
                            <option key={ year } value={ year }>
                              {year}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <ErrorMessage
                        name="year"
                        component="p"
                        className="text-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="majors" className="block pb-1">
                          Major(s)
                        </label>
                        <MultiSelect
                          name="majors"
                          options={ FIELDS_OF_STUDY }
                          placeholder="Select your major(s)"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="minors" className="block pb-1">
                          Minor(s) (optional)
                        </label>
                        <MultiSelect
                          name="minors"
                          // List of minors might be slightly different...fine for now
                          options={ FIELDS_OF_STUDY }
                          placeholder="Select your minor(s)"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={ isSubmitting }
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isSubmitting ? "Loading..." : "Submit"}
                    </button>
                    {submitError && (
                      <p className="text-red-500">{submitError}</p>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Step1;
