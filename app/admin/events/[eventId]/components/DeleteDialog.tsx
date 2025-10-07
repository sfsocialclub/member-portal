import { useDeleteManualCheckinMutation, useDeleteScanMutation, useGetUsersQuery } from "@/lib/admin/adminApi";
import { isManualCheckInRow } from "../util";
import { ManualCheckInRow } from "../util";
import { ScanRow } from "../util";
import { useGetSlackUsersQuery } from "@/lib/slack/api";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    entity?: ScanRow | ManualCheckInRow;
};

export const DeleteDialog = ({
    isOpen,
    onClose,
    entity
}: Props) => {
    const [deleteScan] = useDeleteScanMutation();
    const [deleteManualCheckin] = useDeleteManualCheckinMutation();
    const { data: slackUsers, isFetching: isFetchingSlackUsers } = useGetSlackUsersQuery();

    const handleDelete = () => {
        if(entity) {
            if(isManualCheckInRow(entity)) {
                deleteManualCheckin({document_id: entity.id, eventId: entity.event_id}).then(() => {
                    onClose();
                })

            } else {
                deleteScan({scanId: entity.id, eventId: entity.event_id}).then(() => {
                    onClose();
                })
            }
        }
    }

    const userName = entity ? isManualCheckInRow(entity) ? slackUsers?.find((slackUser) => slackUser.id === entity.slack_user_id)?.profile?.real_name : entity.userName : "";

    if(!entity || isFetchingSlackUsers) {
        return null;
    }
    
    return (
        <>
            <input type="checkbox" className="modal-toggle" checked={isOpen} readOnly />
            <div className="modal">
                <div className="modal-box max-w-md">
                    <h3 className="text-lg font-bold mb-4">Delete Check-in</h3>
                    <p className="mb-2">Are you sure you want to delete the check-in for <span className="font-bold">{userName}</span>?</p>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary" onClick={handleDelete}>Delete</button>
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    )
}