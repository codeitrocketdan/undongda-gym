import {
  addMonths as _addMonths,
  addWeeks as _addWeeks,
  differenceInCalendarWeeks as _differenceInCalendarWeeks,
  endOfMonth as _endOfMonth,
  endOfWeek as _endOfWeek,
  format as _format,
  isSameDay as _isSameDay,
  isSameMonth as _isSameMonth,
  startOfMonth as _startOfMonth,
  startOfWeek as _startOfWeek,
  subDays as _subDays,
} from "date-fns";
import { ko } from "date-fns/locale";
export { ko };
type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface WeekOptions {
  weekStartsOn?: WeekStartsOn;
}

// 1. 날짜 포맷팅 (매번 ko를 넘기지 않아도 기본 적용되도록 설정)
export function format(
  date: Date | number | string,
  formatStr: string = "yyyy-MM-dd"
): string {
  return _format(new Date(date), formatStr, { locale: ko });
}

// 2. 날짜 비교 함수
export function isSameDay(
  dateLeft: Date | number,
  dateRight: Date | number
): boolean {
  return _isSameDay(new Date(dateLeft), new Date(dateRight));
}

export function isSameMonth(
  dateLeft: Date | number,
  dateRight: Date | number
): boolean {
  return _isSameMonth(new Date(dateLeft), new Date(dateRight));
}

// 3. 날짜 계산 함수
export function subDays(date: Date | number, amount: number): Date {
  return _subDays(new Date(date), amount);
}

export function addMonths(date: Date | number, amount: number): Date {
  return _addMonths(new Date(date), amount);
}

export function addWeeks(date: Date | number, amount: number): Date {
  return _addWeeks(new Date(date), amount);
}

// 4. 시작일 / 종료일 계산 함수
export function startOfMonth(date: Date | number): Date {
  return _startOfMonth(new Date(date));
}

export function endOfMonth(date: Date | number): Date {
  return _endOfMonth(new Date(date));
}

export function startOfWeek(date: Date | number, options?: WeekOptions): Date {
  return _startOfWeek(new Date(date), options);
}

export function endOfWeek(date: Date | number, options?: WeekOptions): Date {
  return _endOfWeek(new Date(date), options);
}

export function differenceInCalendarWeeks(
  dateLeft: Date | number,
  dateRight: Date | number,
  options?: WeekOptions
): number {
  return _differenceInCalendarWeeks(
    new Date(dateLeft),
    new Date(dateRight),
    options
  );
}
