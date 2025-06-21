import { CalendarEvent } from "@/app/calendar/models";
import { useDeleteEventMutation } from "@/lib/eventsApi";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    event?: CalendarEvent;
};

export const DeleteDialog = ({
    isOpen,
    onClose,
    event
}: Props) => {
    const [deleteEvent] = useDeleteEventMutation();
    const handleDelete = () => {
        if(event) {
            deleteEvent(event.id).then(() => {
                onClose();
            })
        }
    }
    if(!event) {
        return null;
    }
    return (
        <>
            <input type="checkbox" className="modal-toggle" checked={isOpen} readOnly />
            <div className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-lg mb-2">Are you sure you want to delete {event.name}?</h3>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary" onClick={handleDelete}>Delete</button>
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    )
}