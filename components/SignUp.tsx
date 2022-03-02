import { useState } from "react";
import {
  Formik, Form, Field, ErrorMessage, FormikErrors,
} from "formik";
import { useRouter } from "next/router";
import Link from "next/link";
import useSupabase from "../hooks/useSupabase";
import { HOSTNAME } from "../pages/_app";
import GoogleSignIn from "./GoogleSignIn";

interface FormValues {
  email: string;
  password: string;
  passwordConfirm: string;
}

const REDIRECT_URL = `${HOSTNAME}/welcome`;

export default function SignUp() {
  const { signIn, signUp } = useSupabase();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleGoogleSignup = async (): Promise<void> => {
    setSubmitError(null);
    setLoading(true);
    const { error } = await signIn(
      { provider: "google" },
      // Redirect URLs must have the same hostname as the "Site URL" in the
      // Supabase Auth settings or be present in the "Additional Redirect URLs"
      // (additional redirects must match exactly)
      { redirectTo: REDIRECT_URL },
    );
    if (error) {
      setSubmitError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <Formik
          initialValues={ {
            email: "",
            password: "",
            passwordConfirm: "",
          } as FormValues }
          validate={ (values) => {
            setSubmitError(null);
            const errors: FormikErrors<FormValues> = {};

            if (!values.email) {
              errors.email = "Please enter your email";
            } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(values.email)) {
              errors.email = "Please enter a valid email";
            } else if (!values.email.endsWith("@umich.edu")) {
              errors.email = "Please use your UMich email";
            }

            if (!values.password) {
              errors.password = "Please choose a password";
            }
            if (!values.passwordConfirm) {
              errors.passwordConfirm = "Please confirm your password";
            }
            if (
              values.password && values.passwordConfirm
              && values.password !== values.passwordConfirm
            ) {
              errors.passwordConfirm = "Passwords do not match";
            }

            return errors;
          } }
          onSubmit={ async (values, { setSubmitting }) => {
            setLoading(true);
            const { user: existingUser, session, error } = await signUp(
              { email: values.email, password: values.password },
              { redirectTo: REDIRECT_URL },
            );
            if (existingUser && session) {
              // From https://supabase.com/docs/reference/javascript/auth-signup#notes:
              //   New users: a user is returned but session will be null
              //   Existing users: an obfuscated / fake user object will be returned.
              setSubmitError("Found an existing user...redirecting to /login");
              router.push("/login");
            } else if (error) {
              setSubmitError(error.message);
            } else {
              // Per https://github.com/supabase/supabase/discussions/3526,
              // there's no way to resend the verification email...
              setSubmitMessage(`We've sent an email to ${values.email} — please click the link to verify your email`);
            }
            setLoading(false);
            setSubmitting(false);
          } }
        >
          {({ errors, isSubmitting }) => (
            <Form className="flex flex-col w-1/2 gap-y-4">
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="billymagic@umich.edu"
                  autoComplete="email" />
                <ErrorMessage name="email" component="p" className="text-red-500" />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="new-password" />
                <ErrorMessage name="password" component="p" className="text-red-500" />
              </div>
              <div>
                <Field
                  type="password"
                  name="passwordConfirm"
                  placeholder="Confirm password"
                  autoComplete="new-password" />
                <ErrorMessage name="passwordConfirm" component="p" className="text-red-500" />
              </div>
              <button type="submit" disabled={ isSubmitting || Object.keys(errors).length > 0 }>
                {isSubmitting ? "Loading..." : "Let's go ›"}
              </button>
              {submitError && <p className="text-red-500">{submitError}</p>}
              {submitMessage && <p className="text-green-500">{submitMessage}</p>}
            </Form>
          )}
        </Formik>
        <GoogleSignIn
          onClick={ handleGoogleSignup }
          disabled={ loading }
        />
        <Link href="/login" passHref>
          <p className="link">Already have an account? Log in</p>
        </Link>
      </div>
    </div>
  );
}
