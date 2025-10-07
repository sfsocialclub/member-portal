import { useGetUsersQuery, useManualCheckInMutation } from "@/lib/admin/adminApi";
import { useGetEventAsAdminQuery } from "@/lib/eventsApi";
import { useGetSlackUsersQuery } from "@/lib/slack/api";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

type CheckInFormData = {
    slackUserIds: string[];
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const initialDataDefault: CheckInFormData = {
    slackUserIds: []
}

export const CheckInModal = ({
    isOpen,
    onClose,
}: Props) => {
    const eventId = useParams().eventId as string;
    const { data: event, isFetching } = useGetEventAsAdminQuery(eventId)
    const { data: slackUsers } = useGetSlackUsersQuery();
    const { data: users} = useGetUsersQuery();
    const [formData, setFormData] = useState<CheckInFormData>(initialDataDefault);
    const [submit] = useManualCheckInMutation();

    const sortedUsers = useMemo(() => {
        const scannedUserIds = event?.scans?.map(s => s.user_id) ?? [];
        const scannedUserSlackIds = users?.filter(u => scannedUserIds.includes(u.id)).map(u => u.slackId) ?? [];
        const manualCheckInSlackUserIds = event?.manualCheckIns?.map(mc => mc.slack_user_id) ?? [];
        const excludedUserIds = [...scannedUserSlackIds, ...manualCheckInSlackUserIds];

        return (slackUsers ?? [])
            .filter(u => u.id && !excludedUserIds.includes(u.id))
            .filter(u => u.profile?.real_name)
            .sort((a, b) => {
                const nameA = a.profile?.real_name?.toLowerCase() ?? '';
                const nameB = b.profile?.real_name?.toLowerCase() ?? '';
                return nameA.localeCompare(nameB);
            })
            .map(u => ({
                id: u.id,
                name: u.profile?.real_name,
                email: u.profile?.email,
            }));
    }, [slackUsers, users, event?.scans, event?.manualCheckIns]);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit({eventId, slackUserIds: formData.slackUserIds});
        onClose(); // optionally close modal after submit
    };

    return (
        <>
            <input type="checkbox" className="modal-toggle" checked={isOpen} readOnly />
            <div className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-lg mb-2">Check In Members</h3>
                    <form onSubmit={handleSubmit} className="gap-y-4 flex flex-col">
                        <Autocomplete
                            multiple
                            options={sortedUsers}
                            getOptionLabel={(option) => option.name || 'unknown'}
                            filterSelectedOptions
                            onChange={(_, value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    slackUserIds: value.map((u) => u.id!),
                                }))
                            }
                            value={sortedUsers.filter((u) => formData.slackUserIds.includes(u.id!))}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.name}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Members"
                                    placeholder="Search and select member(s)"
                                    fullWidth
                                />
                            )}
                        />

                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}