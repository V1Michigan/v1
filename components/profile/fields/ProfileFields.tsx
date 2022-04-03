import { useState } from "react";
import { Field, ErrorMessage, useField } from "formik";
import { MultiValue } from "react-select";
import useSupabase from "../../../hooks/useSupabase";
import MultiSelect, { ControlledMultiSelect } from "../../MultiSelect";
import {
  Year,
  FieldOfStudy,
  RoleType,
  Interest,
} from "../../../constants/profile";

const FIELDS_OF_STUDY = Object.entries(FieldOfStudy).map(([key, name]) => ({
  value: key,
  label: name,
}));

interface LabelProps {
  label: string | JSX.Element;
}

const NameField = ({ label }: LabelProps) => {
  const validateName = (value: string) => {
    if (!value) {
      return "Please enter your name";
    }
    if (value.length < 2 || value.length > 50) {
      return "Please enter a name between 2 and 50 characters";
    }
    return undefined;
  };
  return (
    <>
      <div className="mt-1 rounded-md shadow-sm">
        <label htmlFor="name" className="block">
          {label}
        </label>
        <Field
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
          type="text"
          name="name"
          placeholder="Name"
          validate={validateName}
        />
      </div>
      <ErrorMessage name="name" component="p" className="text-red-500" />
    </>
  );
};

// We don't allow users to change their email address, this is just here for consistency
const EmailField = ({ value, label }: { value: string } & LabelProps) => (
  <div>
    <label htmlFor="email" className="block">
      {label}
    </label>
    <Field
      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-200 text-gray-500"
      type="email"
      value={value}
      disabled
    />
    {/* Error message, just in case */}
    {/* <ErrorMessage name="email" component="p" className="text-red-500" /> */}
  </div>
);

const UsernameField = ({ label }: LabelProps) => {
  const { supabase, user } = useSupabase();
  // Memo to avoid repeated queries
  const [openUsernames, setOpenUsernames] = useState<{
    [key: string]: boolean;
  }>({});
  const validateUsername = async (value: string) => {
    if (!value) {
      return "Please select a username";
    }
    if (value.length < 3 || value.length > 30) {
      return "Username must be between 3 and 30 characters";
    }
    if (!/^[a-zA-Z\d]*$/.test(value)) {
      return "Usernames must only contain letters and numbers";
    }
    if (openUsernames[value] === undefined) {
      const { count, error, status } = await supabase
        .from("profiles")
        .select("username", { count: "exact", head: true })
        // in case the user is editing their own profile...mostly for testing
        .not("id", "eq", user?.id)
        .eq("username", value);
      if (error && status !== 406) {
        return error.message;
      }
      if (count) {
        return "Username is already taken";
      }
      setOpenUsernames((openUsernames_) => ({
        ...openUsernames_,
        [value]: !count,
      }));
    } else if (!openUsernames[value]) {
      return "Username is already taken";
    }
    return undefined;
  };
  return (
    <>
      <div className="mt-1 rounded-md shadow-sm">
        <label htmlFor="username" className="block">
          {label}
        </label>
        <Field
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
          type="text"
          name="username"
          placeholder="Username"
          validate={validateUsername}
        />
      </div>
      <ErrorMessage name="username" component="p" className="text-red-500" />
    </>
  );
};

const PhoneField = ({ label }: LabelProps) => {
  const validatePhone = (value: string) => {
    if (!value) {
      return "Please enter your phone number";
    }
    if (!/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)) {
      return "Please enter a valid phone number. For country codes, use + followed by the country code";
    }
    return undefined;
  };
  return (
    <>
      <div className="mt-1 rounded-md shadow-sm">
        <label htmlFor="phone" className="block">
          {label}
        </label>
        <Field
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
          type="tel"
          name="phone"
          placeholder="###-###-####"
          validate={validatePhone}
        />
      </div>
      <ErrorMessage name="phone" component="p" className="text-red-500" />
    </>
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
      <label htmlFor="year" className="block">
        {label}
      </label>
      <Field
        className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
        as="select"
        name="year"
        validate={validateYear}
      >
        <option value="" disabled hidden>
          Select your year
        </option>
        {Object.entries(Year).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </Field>
      <ErrorMessage name="year" component="p" className="text-red-500" />
    </div>
  );
};

interface Option {
  label: string;
  value: string;
}

interface FieldsOfStudy {
  majors: string[];
  minors: string[];
}

const FieldsOfStudyFields = ({
  majorsLabel,
  minorsLabel,
}: {
  majorsLabel: string;
  minorsLabel: string;
}) => {
  const validate = (value: FieldsOfStudy) => {
    // No minors validation required
    if (value.majors.length === 0) {
      return "Please select at least one major, or 'Undecided'";
    }
    return undefined;
  };
  const [field, _, { setValue, setTouched }] = useField<FieldsOfStudy>({
    name: "fields_of_study",
    validate,
  });
  return (
    <>
      <div>
        <label htmlFor="fields_of_study.majors" className="block pb-1">
          {majorsLabel}
        </label>
        <ControlledMultiSelect
          name="fields_of_study.majors"
          value={FIELDS_OF_STUDY.filter(
            (option) => field.value.majors.indexOf(option.value) !== -1
          )}
          options={FIELDS_OF_STUDY}
          onChange={(option: MultiValue<Option>) => {
            setValue({
              ...field.value,
              majors: (option as Option[]).map((item) => item.value),
            });
          }}
          onBlur={() => setTouched(true)}
        />
        <ErrorMessage
          name="fields_of_study"
          component="p"
          className="text-red-500"
        />
      </div>
      <div>
        <label htmlFor="fields_of_study.minors" className="block pb-1">
          {minorsLabel}
        </label>
        <ControlledMultiSelect
          name="fields_of_study.minors"
          value={FIELDS_OF_STUDY.filter(
            (option) => field.value.minors.indexOf(option.value) !== -1
          )}
          // List of minors might be slightly different...fine for now
          options={FIELDS_OF_STUDY}
          onChange={(option: MultiValue<Option>) => {
            setValue({
              ...field.value,
              minors: (option as Option[]).map((item) => item.value),
            });
          }}
          onBlur={() => setTouched(true)}
        />
      </div>
    </>
  );
};

const RolesField = ({ label }: LabelProps) => {
  const validateRoles = (value: string[]) => {
    if (value.length === 0) {
      return "Please select at least one role";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="roles" className="block pb-1">
        {label}
      </label>
      <MultiSelect
        name="roles"
        options={Object.entries(RoleType).map(([k, v]) => ({
          value: k,
          label: v,
        }))}
        validate={validateRoles}
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
      <label htmlFor="interests" className="block pb-1">
        {label}
      </label>
      <MultiSelect
        name="interests"
        options={Object.entries(Interest).map(([k, v]) => ({
          value: k,
          label: v,
        }))}
        validate={validateInterests}
      />
      <ErrorMessage name="interests" component="p" className="text-red-500" />
    </div>
  );
};

const BioField = ({ label }: LabelProps) => {
  const validateBio = (value: string) => {
    if (!value) {
      return "Please enter a short bio";
    }
    if (value.length > 150) {
      return "Please enter a bio less than 150 characters";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="bio">{label}</label>
      <Field
        className="w-full mt-1 self-center focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
        type="text"
        name="bio"
        placeholder="I invented the personal computer, co-founded Apple, and had fun doing it"
        validate={validateBio}
      />
      <ErrorMessage name="bio" component="p" className="text-red-500" />
    </div>
  );
};

const LinkedInField = ({ label }: LabelProps) => {
  const validateLinkedIn = (value: string) => {
    // Note that LinkedIn is optional
    if (value && !/https:\/\/(www\.)?linkedin\.com\/in\/.{3,100}/.test(value)) {
      return "Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/billymagic)";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="linkedin">{label}</label>
      <Field
        className="w-full mt-1 self-center focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
        type="text"
        name="linkedin"
        placeholder="https://linkedin.com/in/billymagic"
        validate={validateLinkedIn}
      />
      <ErrorMessage name="linkedin" component="p" className="text-red-500" />
    </div>
  );
};

// Note: current DB column name is `website`, not `additional_links`
const AdditionalLinksField = ({ label }: LabelProps) => {
  const validateAdditionalLinks = (value: string) => {
    // Note that "additional links" is optional
    if (value && value.length > 500) {
      return "Please limit additional links to 500 characters";
    }
    return undefined;
  };
  return (
    <div>
      <label htmlFor="website">{label}</label>
      <Field
        className="w-full justify-self-center mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
        type="text"
        name="website"
        placeholder="E.g. personal site, Twitter, past projects..."
        validate={validateAdditionalLinks}
      />
      <ErrorMessage name="website" component="p" className="text-red-500" />
    </div>
  );
};

const PartnerSharingConsentField = () => (
  <div className="flex items-center justify-center gap-x-2">
    {/* Note the snake case here, consistent with the DB column name */}
    <label htmlFor="partner_sharing_consent">
      To help you find your next best role, can we share your profile with
      select startups or other partner organizations?
    </label>
    <Field
      className="block shadow border-gray-300 rounded-md"
      type="checkbox"
      name="partner_sharing_consent"
      id="partner_sharing_consent"
    />
  </div>
);

export {
  NameField,
  EmailField,
  UsernameField,
  PhoneField,
  YearField,
  FieldsOfStudyFields,
  RolesField,
  InterestsField,
  BioField,
  LinkedInField,
  AdditionalLinksField,
  PartnerSharingConsentField,
};
