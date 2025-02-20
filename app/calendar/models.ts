
export type CalendarEvent = {
    id: string;
    startDateTime: string;
    endDateTime: string;
    name: string;
    description: string;
    points: number;
    location: {
        name: string;
        address: string;
    };
};

export interface UserCalendarEvent extends CalendarEvent {
    status: RsvpStatus
}

export enum RsvpStatus {
    attended = 'attended',
    maybe = 'maybe',
    no = 'no'
}