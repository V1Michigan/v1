import { ErrorMessage, useField } from "formik";
import Dropzone from "react-dropzone";

// Consider combining this with EditAvatar...lots of duplicated code
const EditResume = () => {
  const validate = (resume: File) => {
    if (!resume) {
      return "Please upload your resume";
    } if (resume.type !== "application/pdf") {
      return "Please upload a PDF resume";
    } if (resume.size > 5 * 1024 * 1024) {
      return "Please limit resume size to 5 MB";
    }
    return undefined;
  };
  const [field, _, { setValue, setTouched }] = useField({ name: "resume", validate });
  return (
    <Dropzone
      accept="application/pdf"
      maxFiles={ 1 }
      onDrop={ ([file]) => setValue(file) }
    >
      {({ getRootProps, getInputProps }) => (
        /* eslint-disable react/jsx-props-no-spreading */
        <div
          { ...getRootProps({ onClick: () => setTouched(true) }) }
          className="p-4 bg-gray-300 border-black border-2 rounded-lg"
        >
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
