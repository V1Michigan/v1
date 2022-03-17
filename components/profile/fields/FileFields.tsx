import FormikDropzone from "./FormikDropzone";

const AVATAR_TYPES = ["image/jpeg", "image/png", "image/gif"];
const RESUME_TYPE = "application/pdf";

const EditAvatar = () => {
  const validate = (avatar: File) => {
    if (!avatar) {
      return "Please upload a profile picture";
    }
    if (!AVATAR_TYPES.includes(avatar.type)) {
      return "Please upload an JPEG, PNG, or GIF avatar";
    }
    if (avatar.size > 2 * 1024 * 1024) {
      return "Please limit avatar size to 2 MB";
    }
    return undefined;
  };
  return (
    <FormikDropzone
      name="avatar"
      message="Upload a profile picture"
      fileType={AVATAR_TYPES}
      validate={validate}
    />
  );
};

const EditResume = ({ label }: { label: string }) => {
  const validate = (resume: File) => {
    // Note that resume is optional
    if (resume) {
      if (resume.type !== "application/pdf") {
        return "Please upload a PDF resume";
      }
      if (resume.size > 5 * 1024 * 1024) {
        return "Please limit resume size to 5 MB";
      }
    }
    return undefined;
  };
  return (
    <div className="pl-2">
      <FormikDropzone
        name="resume"
        message={label}
        fileType={RESUME_TYPE}
        validate={validate}
      />
    </div>
  );
};

export { EditAvatar, EditResume };
