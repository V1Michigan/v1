import { useState } from "react";
import {
  Formik, Form, Field, ErrorMessage, FormikErrors,
} from "formik";
import Link from "next/link";
import useSupabase from "../hooks/useSupabase";
import GoogleSignIn from "./GoogleSignIn";
import { HOSTNAME } from "../pages/_app";

interface FormValues {
  email: string;
  password: string;
}

const REDIRECT_URL = `${HOSTNAME}/welcome`;

export default function Login() {
  const { signIn } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleGoogleLogin = async (): Promise<void> => {
    setSubmitError(null);
    setLoading(true);
    const { error } = await signIn(
      { provider: "google" },
      { redirectTo: REDIRECT_URL },
    );
    if (error) {
      setSubmitError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="row flex flex-col w-1/2 gap-y-4">
      <div className="col-6 form-widget">
        <Formik
          initialValues={ {
            email: "",
            password: "",
          } as FormValues }
          validate={ (values) => {
            setSubmitError(null);
            const errors: FormikErrors<FormValues> = {};

            if (!values.email) {
              errors.email = "Please enter your email";
            } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(values.email)) {
              errors.email = "Please enter a valid email";
            }

            if (!values.password) {
              errors.password = "Please enter your password";
            }

            return errors;
          } }
          onSubmit={ async (values, { setSubmitting }) => {
            setLoading(true);
            const { error } = await signIn(
              { email: values.email, password: values.password },
              { redirectTo: REDIRECT_URL },
            );
            if (error) {
              setSubmitError(error.message);
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
                  placeholder="Email"
                  autoComplete="email" />
                <ErrorMessage name="email" component="p" className="text-red-500" />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password" />
                <ErrorMessage name="password" component="p" className="text-red-500" />
              </div>
              <button type="submit" disabled={ isSubmitting || Object.keys(errors).length > 0 }>
                {isSubmitting ? "Loading..." : "Login ›"}
              </button>
              {submitError && <p className="text-red-500">{submitError}</p>}
            </Form>
          )}
        </Formik>
      </div>
      <GoogleSignIn
        onClick={ handleGoogleLogin }
        disabled={ loading }
      />
      <Link href="/join" passHref>
        <p className="link">Don&apos;t have an account yet? Sign up</p>
      </Link>
    </div>
  );
}
