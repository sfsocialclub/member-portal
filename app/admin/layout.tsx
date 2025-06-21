'use client'
import { useGetEventAsAdminQuery } from "@/lib/eventsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
const pathMap: Record<string, string> = {
    '/admin/users': 'Users',
    '/admin/events': 'Events',
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    const isEventDetailPage =
        segments.length === 3 && segments[0] === 'admin' && segments[1] === 'events'

    const eventId = isEventDetailPage ? segments[2] : null

    const { data: event } = useGetEventAsAdminQuery(eventId || skipToken, {
        skip: !isEventDetailPage,
    })

    const breadcrumbs = useMemo(() => {
        if (!pathname.startsWith('/admin')) return null

        if(pathname === '/admin') return null

        const crumbs = [{ name: 'Admin', href: '/admin' }]

        if (segments[1]) {
            const sectionPath = `/admin/${segments[1]}`
            const sectionName = pathMap[sectionPath]
            if (sectionName) {
                crumbs.push({ name: sectionName, href: sectionPath })
            }
        }

        if (isEventDetailPage && event) {
            crumbs.push({ name: event.name, href: pathname })
        }

        return crumbs
    }, [pathname, event, segments, isEventDetailPage])

    return (
        <>
            {breadcrumbs && (
                <div className="mr-auto flex breadcrumbs text-sm overflow-x-visible">
                    <ul>
                        {breadcrumbs.map((crumb, i) => (
                            <li key={i}>
                                {i === breadcrumbs.length - 1 ? (
                                    <span>{crumb.name}</span>
                                ) : (
                                    <Link href={crumb.href}>{crumb.name}</Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {children}
        </>
    )
}

export default AdminLayout