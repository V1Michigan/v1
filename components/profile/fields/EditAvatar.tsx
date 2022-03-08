import { ErrorMessage, useField } from "formik";
import Dropzone from "react-dropzone";

const EditAvatar = () => {
  const [field, _, { setValue, setError }] = useField("avatar");
  const validateAvatar = (avatar: File) => {
    if (!avatar) {
      return "Please upload a profile picture";
    } if (!["image/jpeg", "image/png", "image/gif"].includes(avatar.type)) {
      return "Please upload an image avatar";
    } if (avatar.size > 2 * 1024 * 1024) {
      return "Please limit avatar size to 2 MB";
    }
    return undefined;
  };
  const onChange = (avatar: File) => {
    setError(validateAvatar(avatar));
    setValue(avatar);
  };
  return (
    <Dropzone
      accept="image/jpeg, image/png, image/gif"
      maxFiles={ 1 }
      onDrop={ ([file]) => onChange(file) }
    >
      {({ getRootProps, getInputProps }) => (
      /* eslint-disable react/jsx-props-no-spreading */
        <div { ...getRootProps() } className="p-4 bg-gray-300 border-black border-2 rounded-lg">
          <input { ...getInputProps() } />
          <p>
            Select a profile picture (*.jpeg, *.png, *.gif)
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
          <ErrorMessage name="avatar" component="p" className="text-red-500" />
        </div>
      )}
    </Dropzone>
  );
};

export default EditAvatar;
