export interface CalendarPickerProps {
  value?: Date | undefined;
  onChange?: (date?: Date) => void;
  label?: string;
}

export interface TimePickerProps {
  value?: string;
  selectedDate?: Date;
  onChange?: (time: string) => void;
}
