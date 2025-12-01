
export type CalendarEvent = {
    id: string;
    startDateTime: string;
    endDateTime: string;
    name: string;
    description: string;
    location: {
        name: string;
        address: string;
    };
    scanned: boolean; // Only visible to non-admins
    userIsHost: boolean; // Only visible to non-admins
    hostUserIds: string[]; // Slack ID of users. Only visible to admins
    checkInCount: number; // Only visible to admins
    scans: Scan[] // Only visible to admins
    manualCheckIns: ManualCheckIn[] // Only visible to admins
    isPrivate: boolean;
};

export interface ManualCheckIn {
    id: string;
    created_by: string;
    slack_user_id: string;
    event_id: string;
    created_at: string;
    createdByName: string;
    userName: string;
}

export interface Scan {
    id: string;
    slack_id: string;
    userName: string;
    event_id: string;
    scan_time: string;
    scanned_by: string;
    scannedByName: string;
}

export interface UserCalendarEvent extends CalendarEvent {
    status?: RsvpStatus
}

export enum RsvpStatus {
    yes = 'yes',
    maybe = 'maybe',
    no = 'no'
}