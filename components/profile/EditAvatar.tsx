import { ErrorMessage } from "formik";
import Dropzone from "react-dropzone";

interface EditAvatarProps {
  value: File | null;
  onChange: (value: File) => void;
}

const EditAvatar = ({ value, onChange }: EditAvatarProps) => (
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
          {value?.name && (
            <>
              :
              <b>
                {" "}
                {value.name}
              </b>
            </>
          )}
        </p>
        <ErrorMessage name="avatar" component="p" className="text-red-500" />
      </div>
    )}
  </Dropzone>
);

export default EditAvatar;
