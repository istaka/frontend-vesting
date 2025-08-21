import Select from "react-select";
import "./CustomSelect.scss";

interface CustomSelectProps {
  options?: any;
  menuIsOpen?: boolean;
  isSearchable?: boolean;
  defaultValue?: any;
  className?: string;
  onChange?: any;
  selectedOption?: string;
  placeholder?: string;
}

const CustomSelect = ({
  options,
  menuIsOpen,
  isSearchable,
  defaultValue,
  className,
  onChange,
  selectedOption,
  placeholder = "Select Vesting Address"
}: CustomSelectProps) => {
  return (
    <Select
      options={options}
      className={`common-select ${className ? className : ""}`}
      classNamePrefix="react-select"
      menuIsOpen={menuIsOpen}
      isSearchable={isSearchable}
      // defaultValue={defaultValue}
      onChange={onChange}
      value={selectedOption}
      placeholder={placeholder}
    />
  );
};

export default CustomSelect;
