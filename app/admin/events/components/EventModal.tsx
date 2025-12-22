'use client';
import { formatDateTimeForForm } from "@/lib/util/dateFormatters";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export type EventFormData = {
    name: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    location: {
        name: string;
        address: string;
    };
    hostUserIds: string[];
    isPrivate: boolean;
};

type User = {
    id?: string;
    name?: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EventFormData) => void;
    isEditing: boolean;
    initialData?: Partial<EventFormData>;
    users: User[];
};

const initialDataDefault: EventFormData = {
    name: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    location: { name: "", address: "" },
    hostUserIds: [],
    isPrivate: false
}

export const EventModal = ({
    isOpen,
    onClose,
    onSubmit,
    isEditing,
    initialData = {
        name: "",
        description: "",
        startDateTime: "",
        endDateTime: "",
        location: { name: "", address: "" },
        hostUserIds: [],
    },
    users
}: Props) => {
    const [formData, setFormData] = useState<EventFormData>({ ...initialDataDefault, ...initialData });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name.startsWith("location.")) {
            const [, locField] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [locField]: value,
                },
            }));
        } else if (name === "isPrivate") {
            setFormData((prev) => ({
                ...prev,
                isPrivate: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose(); // optionally close modal after submit
    };

    return (
        <>
            <input type="checkbox" className="modal-toggle" checked={isOpen} readOnly />
            <div className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-lg mb-2">{isEditing ? "Edit Event" : "Create Event"}</h3>
                    <form onSubmit={handleSubmit} className="gap-y-4 flex flex-col">
                        <TextField
                            label="Event Name"
                            name="name"
                            fullWidth
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter event name"
                        />

                        <TextField
                            label="Description"
                            name="description"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Start Date & Time"
                                name="startDateTime"
                                type="datetime-local"
                                fullWidth
                                value={formData.startDateTime ? formatDateTimeForForm(formData.startDateTime) : ""}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="End Date & Time"
                                name="endDateTime"
                                type="datetime-local"
                                fullWidth
                                value={formData.endDateTime ? formatDateTimeForForm(formData.endDateTime) : ""}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>

                        <TextField
                            label="Location Name"
                            name="location.name"
                            fullWidth
                            value={formData.location.name}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Address"
                            name="location.address"
                            fullWidth
                            value={formData.location.address}
                            onChange={handleChange}
                        />

                        <Autocomplete
                            multiple
                            options={users}
                            getOptionLabel={(option) => option.name || 'unknown'}
                            filterSelectedOptions
                            onChange={(_, value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    hostUserIds: value.map((u) => u.id!),
                                }))
                            }
                            value={users.filter((u) => formData.hostUserIds.includes(u.id!))}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.name}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Event Host(s)"
                                    placeholder="Search and select host(s)"
                                    fullWidth
                                />
                            )}
                        />
                        <FormControl
                            fullWidth
                            variant="outlined"
                        >
                            <FormControlLabel
                                id="isPrivate-label"
                                control={<Checkbox
                                    id="isPrivate"
                                    name="isPrivate"
                                    checked={formData.isPrivate}
                                    onChange={handleChange}
                                />}
                                label={<><Typography id="isPrivate-label">Private</Typography><Typography variant="body2">Only event hosts or admins can see this event</Typography></>}
                            />

                        </FormControl>



                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
