import { ErrorMessage } from "formik";
import Dropzone from "react-dropzone";

interface EditResumeProps {
  value: File | null;
  onChange: (value: File) => void;
}

const EditResume = ({ value, onChange }: EditResumeProps) => (
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
          {value && (
          <>
            :
            <b>
              {" "}
              {value.name}
            </b>
          </>
          )}
        </p>
        <ErrorMessage name="resume" component="p" className="text-red-500" />
      </div>
    )}
  </Dropzone>
);

export default EditResume;
