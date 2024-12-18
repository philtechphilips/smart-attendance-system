// SelectInput.types.ts

interface Option {
  value: string;
  label: string;
}

export interface SelectInputProps {
  label: string;
  labelColor?: boolean;
  options: Option[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
