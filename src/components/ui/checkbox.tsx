import { CheckIcon } from 'lucide-react';
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: () => void;
}

export function Checkbox({ checked, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onCheckedChange}
        {...props}
      />
      <div
        className={`w-5 h-5 border rounded transition-colors duration-200 
          ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'} 
          flex items-center justify-center`}
      >
        {checked && <CheckIcon className="w-4 h-4 text-white" />}
      </div>
    </label>
  );
}
