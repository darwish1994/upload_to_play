import React from 'react';

interface TextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'url';
  required?: boolean;
  error?: string;
  maxLength?: number;
  dir?: 'ltr' | 'rtl';
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  error,
  maxLength,
  dir = 'ltr',
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        dir={dir}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
      />
      {maxLength && (
        <div className="mt-1 text-xs text-gray-500 flex justify-end">
          {value.length}/{maxLength}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextField;