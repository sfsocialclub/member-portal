import { ManualCheckIn, Scan } from "@/app/calendar/models";

export type ScanRow = Scan & { type: string; };
export type ManualCheckInRow = ManualCheckIn & { type: string; };
export const isManualCheckInRow = (row: ScanRow | ManualCheckInRow): row is ManualCheckInRow => (row as ManualCheckInRow).type === 'manualCheckIn';

