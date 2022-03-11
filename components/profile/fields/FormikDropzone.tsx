import { ErrorMessage, useField } from "formik";
import Dropzone from "react-dropzone";

interface FormikDropzoneProps {
  name: string;
  message: string;
  fileType: string | string[];
  validate?: (value: File) => string | undefined;
}

const FormikDropzone = ({
  name, message, fileType: fileType_, validate,
}: FormikDropzoneProps) => {
  const [field, _, { setValue, setTouched }] = useField({ name, validate });
  const fileType = Array.isArray(fileType_) ? fileType_ : [fileType_];
  return (
    <Dropzone
      accept={ fileType.join(", ") }
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
            {message}
            {" "}
            (
            {fileType.map((type) => `*.${type.split("/")[1]}`).join(", ")}
            )
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
          <ErrorMessage name={ name } component="p" className="text-red-500" />
        </div>
      )}
    </Dropzone>
  );
};

export default FormikDropzone;
