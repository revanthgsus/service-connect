import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const components = { DropdownIndicator: null, };

const createOption = (label) => ({ label, value: label, });

const MultiSelect = ({ selectedValues, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(
    selectedValues ? selectedValues.split(',').map((val) => createOption(val)) : []
  );

  const handleKeyDown = (event) => {
    if (!inputValue.trim()) return;

    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const newOption = createOption(inputValue);

      if (!selectedOptions.some((option) => option.value === newOption.value)) {
        const updatedOptions = [...selectedOptions, newOption];
        setSelectedOptions(updatedOptions);
        onChange(updatedOptions.map((opt) => opt.value).join(','));
      }
      setInputValue('');
    }
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={inputValue.trim().length > 0}
      onChange={(newValue) => {
        setSelectedOptions(newValue || []);
        onChange(newValue.map((opt) => opt.value).join(','));
      }}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder="Type and press enter..."
      value={selectedOptions}
      className='multiselect'
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "var(--navbar-color)",
          borderColor: state.isFocused ? "#01848d" : "#858585",
          boxShadow: state.isFocused ? "none" : "none",
          outline: state.isFocused ? "1px solid #01848d" : "none",
          "&:hover": {
            borderColor: "#01848d",
          },
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: "#464646",
          padding: "3px 7px",
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: "#6f6f6f",
          cursor: "pointer",
        }),
        placeholder: (base) => ({
          ...base,
          color: "var(--placeholder-color)",
        }),
        input: (base) => ({
          ...base,
          color: "var(--text-color)",
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected ? "#01848d" : isFocused ? "#e0f7fa" : "#fff",
          color: isSelected ? "#fff" : "#333",
        }),
        clearIndicator: (base) => ({
          ...base,
          color: "#6f6f6f",
          "&:hover": {
            color: "#e95757",
          },
        }),
      }}
    />
  );
};

export default MultiSelect;
