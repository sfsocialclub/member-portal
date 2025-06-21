'use client';
import { SlackUser, useGetSlackUsersQuery } from "@/lib/slack/api";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const cols: GridColDef<SlackUser>[] = [
    {
        field: 'profile',
        headerName: 'Name',
        width: 200,
        valueGetter: (profile: SlackUser['profile']) => {
            return profile?.real_name
        },
    },
    {
        field: 'is_admin',
        headerName: 'Admin',
        width: 100,
        valueGetter: (is_admin: SlackUser['is_admin']) => {
            return is_admin ? 'Yes' : 'No'
        },
    }
]
const users = [
    {
        "id": "USLACKBOT",
        "name": "slackbot",
        "is_bot": false,
        "updated": 0,
        "is_app_user": false,
        "team_id": "T064S5PBV0A",
        "deleted": false,
        "color": "757575",
        "is_email_confirmed": false,
        "real_name": "Slackbot",
        "tz": "America/Los_Angeles",
        "tz_label": "Pacific Daylight Time",
        "tz_offset": -25200,
        "is_admin": false,
        "is_owner": false,
        "is_primary_owner": false,
        "is_restricted": false,
        "is_ultra_restricted": false,
        "who_can_share_contact_card": "EVERYONE",
        "profile": {
            "real_name": "Slackbot",
            "display_name": "Slackbot",
            "avatar_hash": "sv41d8cd98f0",
            "real_name_normalized": "Slackbot",
            "display_name_normalized": "Slackbot",
            "image_24": "https://a.slack-edge.com/80588/img/slackbot_24.png",
            "image_32": "https://a.slack-edge.com/80588/img/slackbot_32.png",
            "image_48": "https://a.slack-edge.com/80588/img/slackbot_48.png",
            "image_72": "https://a.slack-edge.com/80588/img/slackbot_72.png",
            "image_192": "https://a.slack-edge.com/80588/marketing/img/avatars/slackbot/avatar-slackbot.png",
            "image_512": "https://a.slack-edge.com/80588/img/slackbot_512.png",
            "first_name": "slackbot",
            "last_name": "",
            "team": "T064S5PBV0A",
            "title": "",
            "phone": "",
            "skype": "",
            "fields": {},
            "status_text": "",
            "status_text_canonical": "",
            "status_emoji": "",
            "status_emoji_display_info": [],
            "status_expiration": 0,
            "always_active": true
        }
    },
]

const AdminUsersPage = () => {
    const { data: users, isLoading } = useGetSlackUsersQuery(undefined, {
        refetchOnMountOrArgChange: process.env.NODE_ENV !== 'development',
    });
    
    return <div className="h-full flex w-full">
        <div className="flex flex-col max-h-[calc(100%_-_112px)] max-w-full w-full">
            <DataGrid rows={users} columns={cols} />
        </div>
    </div>;
}
export default AdminUsersPage;