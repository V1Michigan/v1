import { ErrorMessage, useField } from "formik";
import Dropzone from "react-dropzone";

const EditResume = () => {
  const [field, _, { setValue, setError }] = useField("avatar");
  const validateResume = (resume: File) => {
    if (!resume) {
      return "Please upload your resume";
    } if (resume.type !== "application/pdf") {
      return "Please upload a PDF resume";
    } if (resume.size > 5 * 1024 * 1024) {
      return "Please limit resume size to 5 MB";
    }
    return undefined;
  };
  const onChange = (resume: File) => {
    setError(validateResume(resume));
    setValue(resume);
  };
  return (
    <Dropzone
      accept="application/pdf"
      maxFiles={ 1 }
      onDrop={ ([file]) => onChange(file) }
    >
      {({ getRootProps, getInputProps }) => (
      /* eslint-disable react/jsx-props-no-spreading */
        <div { ...getRootProps() } className="p-4 bg-gray-300 border-black border-2 rounded-lg">
          <input { ...getInputProps() } />
          <p>
            Upload your resume (*.pdf)
            {field.value?.name && (
            <>
              :
              <b>
                {" "}
                {field.value.name}
              </b>
            </>
            )}
          </p>
          <ErrorMessage name="resume" component="p" className="text-red-500" />
        </div>
      )}
    </Dropzone>
  );
};

export default EditResume;
