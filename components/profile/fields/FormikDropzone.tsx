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
        setTouched(true);
        setValue(file);
      }}
      onFileDialogCancel={() => setTouched(true)}
    >
      {({ getRootProps, getInputProps }) => (
        /* eslint-disable react/jsx-props-no-spreading */
        <div
          {...getRootProps({
            className:
              "m-2 p-1 pl-2 block w-full cursor-pointer bg-gray-100 border border-gray-500 text-gray-900 focus:outline-none focus:border-transparent rounded-lg",
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
