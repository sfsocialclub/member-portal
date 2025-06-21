
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
    scanned: boolean;
    userIsHost: boolean;
    hostUserIds: string[];
    scanCount: number;
    scans: Scan[]
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