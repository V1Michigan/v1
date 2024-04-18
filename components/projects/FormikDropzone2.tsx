import { ErrorMessage, useField } from "formik";
import Dropzone from "react-dropzone";

interface FormikDropzone2Props {
  name: string;
  message: string;
  fileType: string | string[];
  validate?: (value: File) => string | undefined;
}

const FormikDropzone2 = ({
  name,
  message,
  fileType: fileType_,
  validate,
}: FormikDropzone2Props) => {
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
              "px-2 py-2 border-[1px] border-gray-300 mt-1 self-center focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black bg-white",
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

export default FormikDropzone2;
