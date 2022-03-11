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
  placeholder: string;
}

const MultiSelect = ({
  name,
  options,
  placeholder,
}: MultiSelectProps) => {
  const [field, _, { setValue, setTouched }] = useField(name);
  const value = options.filter((option) => (field.value as string[]).indexOf(option.value) !== -1);

  const onChange = (option: MultiValue<Option>) => {
    setValue((option as Option[]).map((item) => item.value));
  };

  return (
    <Select
      name={ field.name }
      value={ value }
      onChange={ onChange }
      onBlur={ () => setTouched(true) }
      options={ options }
      isMulti
      placeholder={ placeholder }
    />
  );
};

export default MultiSelect;
