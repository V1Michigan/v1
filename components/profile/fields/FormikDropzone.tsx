import { ErrorMessage, useField } from "formik";
import Dropzone from "react-dropzone";

interface FormikDropzoneProps {
  name: string;
  message: string;
  fileType: string | string[];
  validate?: (value: File) => string | undefined;
}

const FormikDropzone = ({
  name,
  message,
  fileType: fileType_,
  validate,
}: FormikDropzoneProps) => {
  const [field, _, { setValue, setTouched }] = useField<File>({
    name,
    validate,
  });
  const fileType = Array.isArray(fileType_) ? fileType_ : [fileType_];
  return (
    <Dropzone
      accept={fileType.join(", ")}
      maxFiles={1}
      onDrop={([file]) => {
        // Order of these two statements is important for some reason,
        // otherwise the value is updated but validate() receives the old value
        setValue(file);
        setTouched(true);
      }}
      onFileDialogCancel={() => setTouched(true)}
    >
      {({ getRootProps, getInputProps }) => (
        /* eslint-disable react/jsx-props-no-spreading */
        <div
          {...getRootProps({
            className:
              "m-2 p-1 md:pl-2 block cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-500 text-gray-900 focus:outline-none focus:border-transparent rounded-lg",
          })}
        >
          <input {...getInputProps()} />
          <p className="text-gray-500 block">
            {message} (
            {fileType.map((type) => `*.${type.split("/")[1]}`).join(", ")})
            {field.value?.name && (
              <>
                :<b> {field.value.name}</b>
              </>
            )}
          </p>
          <ErrorMessage name={name} component="p" className="text-red-500" />
        </div>
      )}
    </Dropzone>
  );
};

export default FormikDropzone;
