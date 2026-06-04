import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onSearch, placeholder = "" }: SearchBarProps) {
  return (
    <label className="flex h-11 w-full cursor-text items-center rounded-full bg-slate-100 pr-3 pl-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-slate-500 outline-none placeholder:text-slate-500"
      />
      <Search className="h-5 w-5 shrink-0 cursor-pointer text-slate-500" onClick={onSearch} />
    </label>
  );
}
