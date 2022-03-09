// Adapted from https://gist.github.com/hubgit/e394e9be07d95cd5e774989178139ae8?permalink_comment_id=3809097#gistcomment-3809097
import { useField } from "formik";
import Select, { MultiValue } from "react-select";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  name: string;
  options: Option[];
  validate?: (value: string[]) => string;
}

const MultiSelect = ({
  name,
  options,
  validate,
}: MultiSelectProps) => {
  const [field, _, { setValue, setTouched, setError }] = useField(name);

  const onChange = (option: MultiValue<Option>) => {
    const value = (option as Option[]).map((item) => item.value);
    setValue(value);
    if (validate) {
      setError(validate(value));
    }
  };

  return (
    <Select
      name={ field.name }
      value={ options.filter((option) => field.value.indexOf(option.value) !== -1) }
      onChange={ onChange }
      onBlur={ () => setTouched(true) }
      options={ options }
      isMulti
    />
  );
};

export default MultiSelect;
