export interface DatePickerProps {
  value?: Date | undefined;
  onChange?: (date?: Date) => void;
  label?: string;
}

export interface TimePickerProps {
  value?: string;
  selectedDate?: Date;
  onChange?: (time: string) => void;
  label?: string;
  // 오늘 날짜 선택 시 현재 시각으로부터 최소 몇 시간 뒤부터 고를 수 있는지 (기본값: MIN_BOOKING_LEAD_HOURS)
  minLeadHours?: number;
}
