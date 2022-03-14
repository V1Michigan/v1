import { useField } from "formik";
import Select, { MultiValue } from "react-select";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  name: string;
  options: Option[];
  validate?: (value: string[]) => string | undefined;
}

const MultiSelect = ({
  name,
  options,
  validate,
}: MultiSelectProps) => {
  const [field, _, { setValue, setTouched }] = useField<string[]>({ name, validate });
  return (
    <Select
      name={ field.name }
      value={ options.filter((option) => field.value.indexOf(option.value) !== -1) }
      onChange={ (option: MultiValue<Option>) => {
        setValue((option as Option[]).map((item) => item.value));
      } }
      onBlur={ () => setTouched(true) }
      options={ options }
      isMulti
      menuPortalTarget={ document.body }
      styles={ { menuPortal: (base) => ({ ...base, zIndex: 9999 }) } }
    />
  );
};

export default MultiSelect;
