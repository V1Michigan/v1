// @ts-nocheck
import Select from 'react-select';

const MultiSelect = ({
  field,
  form,
  options,
  isMulti = false,
  placeholder = 'Select'
}) => {
  function onChange(option) {
    form.setFieldValue(
      field.name,
      option ? (option).map((item) => item.value) : [],
    );
  }

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => field.value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === field.value);
    } else {
      return isMulti ? [] : ('');
    }
  };

  if (!isMulti) {
    return (
      <Select
        options={options}
        name={field.name}
        value={options ? options.find(option => option.value === field.value) : ''}
        onChange={(option) => form.setFieldValue(field.name, option.value)}
        onBlur={field.onBlur}
        placeholder={placeholder}
      />
    )
  } else {
    return (
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        name={field.name}
        value={getValue()}
        onChange={onChange}
        options={options}
        isMulti={true}
        placeholder={placeholder}
      />
    )
  }
}

export default MultiSelect;