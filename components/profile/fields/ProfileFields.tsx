import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import useSupabase from "../../../hooks/useSupabase";
import MultiSelect from "../../MultiSelect";
import {
  Year, FieldOfStudy, RoleType, Interest,
} from "../../../constants/profile";

const FIELDS_OF_STUDY = Object.entries(FieldOfStudy).map(
  ([key, name]) => ({ value: key, label: name }),
);

interface LabelProps {
  label: string | JSX.Element;
}

const NameField = ({ label }: LabelProps) => {
  const validateName = (value: string) => {
    if (!value) {
      return "Please enter your name";
    } if (value.length < 2 || value.length > 50) {
      return "Please enter a name between 2 and 50 characters";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="name" className="block">{label}</label>
      <Field type="text" name="name" placeholder="Name" validate={ validateName } />
      <ErrorMessage name="name" component="p" className="text-red-500" />
    </div>
  );
};

// We don't allow users to change their email address, this is just here for consistency
const EmailField = ({ value, label }: {value: string} & LabelProps) => (
  <div>
    <label htmlFor="email" className="block">{label}</label>
    <Field type="email" value={ value } disabled />
    {/* Error message, just in case */}
    {/* <ErrorMessage name="email" component="p" className="text-red-500" /> */}
  </div>
);

const UsernameField = ({ label }: LabelProps) => {
  const { supabase } = useSupabase();
  // Memo to avoid repeated queries
  const [openUsernames, setOpenUsernames] = useState<{[key: string]: boolean}>({});
  const validateUsername = async (value: string) => {
    if (!value) {
      return "Please select a username";
    } if (value.length < 3 || value.length > 30) {
      return "Username must be between 3 and 30 characters";
    } if (!/^[a-zA-Z\d]*$/.test(value)) {
      return "Usernames must only contain letters and numbers";
    } if (openUsernames[value] === undefined) {
      const { count, error, status } = await supabase
        .from("profiles")
        .select("username", { count: "exact", head: true })
        .eq("username", value);
      if (error && status !== 406) {
        return error.message;
      }
      if (count) {
        return "Username is already taken";
      }
      setOpenUsernames(
        (openUsernames_) => ({ ...openUsernames_, [value]: !count }),
      );
    } else if (!openUsernames[value]) {
      return "Username is already taken";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="username" className="block">{label}</label>
      <Field type="text" name="username" placeholder="Username" validate={ validateUsername } />
      <ErrorMessage name="username" component="p" className="text-red-500" />
    </div>
  );
};

const PhoneField = ({ label }: LabelProps) => {
  const validatePhone = (value: string) => {
    if (!value) {
      return "Please enter your phone number";
    } if (!/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)) {
      return "Please enter a valid phone number. For country codes, use + followed by the country code";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="phone" className="block">{label}</label>
      <Field type="tel" name="phone" placeholder="###-###-####" validate={ validatePhone } />
      <ErrorMessage name="phone" component="p" className="text-red-500" />
    </div>
  );
};

const YearField = ({ label }: LabelProps) => {
  const validateYear = (value: string) => {
    if (!value) {
      return "Please select your year";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="year" className="block">{label}</label>
      <Field as="select" name="year" validate={ validateYear }>
        <option value="" disabled hidden>
          Select your year
        </option>
        {Object.entries(Year).map(([key, value]) => (
          <option key={ key } value={ key }>{value}</option>
        ))}
      </Field>
      <ErrorMessage name="year" component="p" className="text-red-500" />
    </div>
  );
};

const MajorsField = ({ label }: LabelProps) => {
  const validateMajors = (value: string[]) => {
    if (value.length === 0) {
      return "Please select at least one major, or 'Undecided'";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="majors" className="block">{label}</label>
      <MultiSelect
        name="majors"
        options={ FIELDS_OF_STUDY }
        validate={ validateMajors }
      />
      <ErrorMessage name="majors" component="p" className="text-red-500" />
    </div>
  );
};

// No validation required
const MinorsField = ({ label }: LabelProps) => (
  <div>
    <label htmlFor="minors" className="block">{label}</label>
    <MultiSelect
      name="minors"
      // List of minors might be slightly different...fine for now
      options={ FIELDS_OF_STUDY }
    />
    {/* In case we ever do validation */}
    {/* <ErrorMessage name="minors" component="p" className="text-red-500" /> */}
  </div>
);

const RolesField = ({ label }: LabelProps) => {
  const validateRoles = (value: string[]) => {
    if (value.length === 0) {
      return "Please select at least one role";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="roles">{label}</label>
      <MultiSelect
        name="roles"
        options={ Object.entries(RoleType).map(([k, v]) => ({ value: k, label: v })) }
        validate={ validateRoles }
      />
      <ErrorMessage name="roles" component="p" className="text-red-500" />
    </div>
  );
};

const InterestsField = ({ label }: LabelProps) => {
  const validateInterests = (value: string[]) => {
    if (value.length === 0) {
      return "Please select at least one of your interests";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="interests">{label}</label>
      <MultiSelect
        name="interests"
        options={ Object.entries(Interest).map(([k, v]) => ({ value: k, label: v })) }
        validate={ validateInterests }
      />
      <ErrorMessage name="interests" component="p" className="text-red-500" />
    </div>
  );
};

const LinkedInField = ({ label }: LabelProps) => {
  const validateLinkedIn = (value: string) => {
    // Note that LinkedIn is optional
    if (value && !/https:\/\/linkedin\.com\/in\/.{3,100}/.test(value)) {
      return (
        "Please enter a valid LinkedIn profile URL (e.g. https://www.linkedin.com/in/billymagic)"
      );
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="linkedin">{label}</label>
      <Field type="text" name="linkedin" placeholder="https://linkedin.com/in/billymagic" validate={ validateLinkedIn } />
      <ErrorMessage name="linkedin" component="p" className="text-red-500" />
    </div>
  );
};

const AdditionalLinksField = ({ label }: LabelProps) => {
  const validateAdditionalLinks = (value: string) => {
    // Note that additionalLinks is optional
    if (value && value.length > 500) {
      return "Please limit additional links to 500 characters";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="additionalLinks">{label}</label>
      <Field
        type="text"
        name="additionalLinks"
        placeholder="E.g. personal site, Twitter, past projects..."
        validate={ validateAdditionalLinks }
      />
      <ErrorMessage name="additionalLinks" component="p" className="text-red-500" />
    </div>
  );
};

export {
  NameField,
  EmailField,
  UsernameField,
  PhoneField,
  YearField,
  MajorsField,
  MinorsField,
  RolesField,
  InterestsField,
  LinkedInField,
  AdditionalLinksField,
};
