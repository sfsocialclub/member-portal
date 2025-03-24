
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
};

export interface UserCalendarEvent extends CalendarEvent {
    status: RsvpStatus
}

export enum RsvpStatus {
    yes = 'yes',
    maybe = 'maybe',
    no = 'no'
}