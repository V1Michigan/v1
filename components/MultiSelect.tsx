import { useField } from "formik";
import Select, { MultiValue } from "react-select";

interface Option {
  label: string;
  value: string;
}

interface ControlledMultiSelectProps {
  value: Option[];
  options: Option[];
  placeholder?: string;
  onChange: (value: MultiValue<Option>) => void;
  onBlur?: () => void;
}

const ControlledMultiSelect = ({
  value,
  options,
  placeholder,
  onChange,
  onBlur,
}: ControlledMultiSelectProps) => (
  <Select
    value={value}
    options={options}
    placeholder={placeholder}
    onChange={onChange}
    onBlur={onBlur}
    isMulti
    menuPortalTarget={document.body}
    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
  />
);

interface FormikMultiSelectProps {
  name: string;
  options: Option[];
  validate?: (value: string[]) => string | undefined;
}

const FormikMultiSelect = ({
  name,
  options,
  validate,
}: FormikMultiSelectProps) => {
  const [field, _, { setValue, setTouched }] = useField<string[]>({
    name,
    validate,
  });
  return (
    <ControlledMultiSelect
      value={options.filter(
        (option) => field.value.indexOf(option.value) !== -1
      )}
      options={options}
      onChange={(option: MultiValue<Option>) => {
        setValue((option as Option[]).map((item) => item.value));
      }}
      onBlur={() => setTouched(true)}
    />
  );
};

export { FormikMultiSelect as default, ControlledMultiSelect };
