
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
    scanCount: number; // Only visible to admins
    scans: Scan[] // Only visible to admins
};

export interface Scan {
    id: string;
    user_id: string;
    userName: string;
    event_id: string;
    scan_time: string;
}

export interface UserCalendarEvent extends CalendarEvent {
    status?: RsvpStatus
}

export enum RsvpStatus {
    yes = 'yes',
    maybe = 'maybe',
    no = 'no'
}