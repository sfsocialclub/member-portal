import { Scan } from "@/app/calendar/models";
import { useDeleteScanMutation } from "@/lib/admin/adminApi";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    scan?: Scan;
};

export const DeleteDialog = ({
    isOpen,
    onClose,
    scan
}: Props) => {
    const [deleteScan] = useDeleteScanMutation();
    const handleDelete = () => {
        if(scan) {
            deleteScan({scanId: scan.id, eventId: scan.event_id}).then(() => {
                onClose();
            })
        }
    }
    if(!scan) {
        return null;
    }
    return (
        <>
            <input type="checkbox" className="modal-toggle" checked={isOpen} readOnly />
            <div className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-lg mb-2">Are you sure you want to delete the scan for {scan.userName}?</h3>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary" onClick={handleDelete}>Delete</button>
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    )
}