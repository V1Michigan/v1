import ReactGA from "react-ga4";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import Head from "../../components/Head";
import isObjectEqual from "../../utils/isObjectEqual";
import useSupabase from "../../hooks/useSupabase";
import NavbarBuilder from "../../components/NavBar";
import FormikDropzone from "../../components/profile/fields/FormikDropzone";
import FormikDropzone2 from "../../components/projects/FormikDropzone2";

// Username included separately
export type MemberProject = {
  name: string;
  description: string;
  categories: string;
  logo?: File;
  link?: string;
  created_at?: string;
  created_by?: string;
};

type ProjectType = {
  id: string;
  name: string;
  description: string;
  categories: string;
  link: string;
  created_at: Date;
};

const defaultProject = {
  name: "",
  description: "",
  categories: "web",
  link: "",
};

const PROJECT_COLUMNS = () => "id, name, type, logo, description, link";

const ProjectUpload: NextPage = () => {
  const { supabase, username: currentUsername } = useSupabase();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [initialProject, setInitialProject] =
    useState<MemberProject>(defaultProject);

  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);
  const [_, setFormSubmitErrors] = useState<string[]>([]);

  useEffect(() => {
    document.body.classList.add("bg-gray-800");
    return () => {
      document.body.classList.remove("bg-gray-800");
    };
  }, []);

  const saveProject = async (projectData: MemberProject) => {
    if (!initialProject || isObjectEqual(initialProject, projectData)) {
      return;
    }
    setFormSubmitErrors([]);
    const { name, logo, description, categories, link } = projectData;
    const { data, error } = await supabase
      .from<ProjectType>("projects")
      .insert({
        name,
        description,
        categories,
        link,
        created_at: new Date(),
      });
    const results = await Promise.all([
      // FIXME: update path to be an id
      logo &&
      data &&
      supabase.storage.from("projects").upload(data[0].id, logo, {
        contentType: logo.type,
        cacheControl: "3600",
        upsert: true,
      }),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const errors = results
      .map((result) => result && result?.error)
      .filter(Boolean) as (Error | PostgrestError)[];
    if (errors.length > 0) {
      setFormSubmitErrors(errors.map(({ message }) => message));
    } else {
      setInitialProject(projectData);
      setEditMode(false);
      ReactGA.event({
        category: "Project",
        action: "Uploaded project",
      });
    }
    router.push("/projects");
  };

  return (
    <div className="h-screen bg-gray-50">
      <NavbarBuilder />
      <div className="w-full p-4 md:p-8 flex flex-col items-center bg-gray-50">
        <div className="max-w-screen-2xl relative w-full">
          <div className="flex flex-col items-center max-w-screen-2xl w-full static">
            <div className="w-full rounded-2xl text-black flex flex-col items-center gap-y-4">
              <h1 className="font-bold text-5xl mt-2 text-center">
                Upload Your Project
              </h1>
            </div>
            <Formik
              enableReinitialize // to update when resetting initialProfile after submit
              initialValues={initialProject}
              validate={() => setFormSubmitErrors([])}
              onSubmit={saveProject}
            >
              {() => (
                <div className="w-[40%] min-w-screen p-4 md:p-8 md:pl-16 flex justify- items-center text-white">
                  <Head title="Upload Your Project" />
                  <Form className="w-full flex flex-col gap-4">
                    <div>
                      <label
                        className="text-black font-sans text-sm font-semibold"
                        htmlFor="name"
                      >
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        className="mt-1 self-center focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                        type="text"
                        name="name"
                        placeholder="Project name..."
                        validate={(value: string) =>
                          !value ? "Project name is required" : ""
                        }
                      />
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="mt-1.5 text-xs text-red-500"
                      />
                    </div>
                    <div>
                      <label
                        className="text-black font-sans text-sm font-semibold"
                        htmlFor="name"
                      >
                        Description
                      </label>
                      <Field
                        className="mt-1 h-20 self-center focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                        as="textarea"
                        name="description"
                      />
                    </div>
                    <div>
                      <label
                        className="text-black font-sans text-sm font-semibold"
                        htmlFor="name"
                      >
                        Categories
                      </label>
                      <Field
                        className="mt-1 self-center focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                        as="select"
                        name="type"
                        placeholder="Select..."
                      >
                        <option value="mobile">Mobile App</option>
                        <option value="web">Web App</option>
                        <option value="ml-ai">ML/AI</option>
                        <option value="game">Game</option>
                        <option value="other">Other</option>
                      </Field>
                    </div>
                    <div>
                      <label
                        className="text-black font-sans text-sm font-semibold"
                        htmlFor="name"
                      >
                        Link
                      </label>
                      <Field
                        className="mt-1 self-center focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                        type="text"
                        name="link"
                        placeholder="Link to project..."
                      />
                    </div>
                    <div>
                      <label
                        className="text-black font-sans text-sm font-semibold"
                        htmlFor="name"
                      >
                        Logo
                      </label>
                      <FormikDropzone2
                        name="logo"
                        message="Upload a project logo"
                        fileType={["image/jpeg", "image/png", "image/gif"]}
                        validate={(logo: File) => {
                          if (logo?.size > 1 * 1024 * 1024) {
                            return "Please limit avatar size to 2 MB";
                          }
                          return "";
                        }}
                      />
                      {/* <Field
                        className="border-[1px] !outline-none bg-white p-2 mt-1 self-center focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                        type="file"
                        name="logo"
                        accept={["image/jpeg", "image/png", "image/gif"].join(
                          ", "
                        )}
                        placeholder="Project logo..."
                        validate={(logo: File) => {
                          console.log(logo)
                          if (logo?.size > 1 * 1024 * 1024) {
                            return "Please limit avatar size to 2 MB";
                          }
                          return "";
                        }}
                      /> */}
                    </div>
                    <button
                      type="submit"
                      className="gap-2 mr-auto px-3 py-1.5 bg-black rounded-md flex items-center "
                    >
                      <h1 className=" font-medium text-sm">Upload</h1>
                      <h1 className="text-md">{"->"}</h1>
                    </button>
                    <ErrorMessage
                      name="bio"
                      component="p"
                      className="text-red-500"
                    />

                    {/* {editMode ? (
                      <EditProfile profile={values} />
                    ) : (
                      <ViewProfile profile={values} />
                    )} */}

                    {dataFetchErrors.map((error) => (
                      <p key={error} className="text-red-500">
                        {error}
                      </p>
                    ))}
                  </Form>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectUpload;
