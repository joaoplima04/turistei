import { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ label, type, name, value, onChange }: InputFieldProps) => (
  <div style={{ marginBottom: '1rem' }}>
    <label>
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{ display: 'block', padding: '8px', width: '100%' }}
      />
    </label>
  </div>
);

export default InputField;
