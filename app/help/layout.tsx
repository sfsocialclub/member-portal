'use client'
import { useGetEventAsAdminQuery } from "@/lib/eventsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
const pathMap: Record<string, string> = {
    '/help/add-app-to-home-screen': 'Add to Home screen',
    '/help/guide': 'Guide',
}

const HelpLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    const breadcrumbs = useMemo(() => {
        if (!pathname.startsWith('/help')) return null

        if(pathname === '/help') return null

        const crumbs = [{ name: 'Help', href: '/help' }]

        if (segments[1]) {
            const sectionPath = `/help/${segments[1]}`
            const sectionName = pathMap[sectionPath]
            if (sectionName) {
                crumbs.push({ name: sectionName, href: sectionPath })
            }
        }

        return crumbs
    }, [pathname, segments])

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

export default HelpLayout