"use client"
import { useAppSelector } from "@/lib/hooks";
import { GetUserResponse, userApi } from "@/lib/user/userApi";
import { UserIcon } from "@heroicons/react/24/outline";
import {QRCodeSVG} from "qrcode.react";

const ProfilePage = () => {
    const userId = useAppSelector(state => state.auth.userId) || ''
    const { data: apiData } = userApi.useGetUserQuery(userId!, {skip: !userId});

    // TODO: Remove and refactor. This is a temporary mock pending backend readiness.
    const data: Partial<GetUserResponse> = {
        name: apiData?.name,
        dateJoined: apiData?.dateJoined
    }

    const formatDateToString = (date:string) =>  new Date(date).toString();
    const formattedDateJoined = data?.dateJoined ? formatDateToString(data.dateJoined['$date']) : '';

    return (
        <div className="container mx-auto p-8">
        <div className="flex flex-col items-center space-y-8">
          {/* User Photo */}
          <div className="avatar">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            {
                !data.photo ? <UserIcon className="w-full h-full p-4"/> : <img src={data.photo} alt={`${data.name}'s avatar`} />
            }
            </div>
          </div>
  
          {/* User Info */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <p className="text-sm text-gray-500">Joined: {formattedDateJoined}</p>
          </div>
  
          {/* QR Code */}
          <div className="p-4 bg-white shadow rounded-lg flex flex-col items-center">
            <QRCodeSVG value={JSON.stringify({userId})} size={128} />
            <p className="mt-2 text-sm text-gray-500">Member ID: {userId}</p>
          </div>
        </div>
      </div>
    )
}

export default ProfilePage;