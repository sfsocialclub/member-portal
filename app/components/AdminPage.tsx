"use client";

export default function AdminPage() {
  return (
    <div className="w-full h-full flex flex-col gap-9 mt-[72px]">
      <div className="h-fit card bg-base-100 w-full shadow-md p-4 flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-base-content">
            Current Events
          </h1>
          <div className="btn btn-primary">Create Event</div>
        </div>
        <div className="divider m-0 p-0" />
        <div className="stack">
          <div className="card bg-primary-content p-1"></div>
        </div>
      </div>
      <div className="h-fit card bg-base-100 w-full shadow-md p-4 flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-base-content">
            Past Events
          </h1>
        </div>
        <div className="divider m-0 p-0" />
        <div className="stack">
          <div className="card bg-primary-content p-1"></div>
        </div>
      </div>
    </div>
  );
}
