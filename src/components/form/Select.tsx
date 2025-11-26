
  import React, { useEffect, useState } from "react";

  interface Option {
    value: string;
    label: string;
  }

  interface SelectProps {
    options: Option[];
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
    defaultValue?: string;
    value?: string;
    error?: boolean;
    hint?: string;
  }

  const Select: React.FC<SelectProps> = ({
    options,
    placeholder = "Select an option",
    onChange,
    className = "",
    defaultValue = "",
    value,
    error = false,
    hint = "",
  }) => {
    const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

    // Keep in sync with external value/defaultValue
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      } else {
        setSelectedValue(defaultValue);
      }
    }, [value, defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setSelectedValue(val);
      onChange(val);
    };

    return (
      <div className="w-full">
        <select
          className={`h-11 w-full appearance-none rounded-lg border ${error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10"
            } px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 
          focus:outline-hidden focus:ring-3 
          dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 
          dark:placeholder:text-white/30 
          dark:focus:border-brand-800
          ${selectedValue ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"} 
          ${className}`}
          value={selectedValue}
          onChange={handleChange}
        >
          <option
            value=""
            disabled
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {placeholder}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Hint or error text */}
        {hint && (
          <p
            className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
              }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  };

  export default Select;
