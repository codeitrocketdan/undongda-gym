import { REGISTRATION_END_HOURS_BEFORE } from "@/features/create-dagym/constants";

export function calculateRegistrationEnd(dateTime: string): string {
  return new Date(
    new Date(dateTime).getTime() - REGISTRATION_END_HOURS_BEFORE * 60 * 60 * 1000
  ).toISOString();
}
