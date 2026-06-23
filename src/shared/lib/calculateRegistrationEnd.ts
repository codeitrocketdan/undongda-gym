import { REGISTRATION_END_HOURS_BEFORE } from "@/features/create-dagym/constants";

export function calculateRegistrationEnd(dateTime: string): string {
  const base = new Date(dateTime);
  if (Number.isNaN(base.getTime())) return "";
  return new Date(
    base.getTime() - REGISTRATION_END_HOURS_BEFORE * 60 * 60 * 1000
  ).toISOString();
}
