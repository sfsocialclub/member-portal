import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        "name": "SF Social Club",
        "short_name": "SFSC",
        "description": "Scan for events at SF Social Club",
        "start_url": "/",
        "icons": [
            {
                "src": "/maskable_icon_x192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/maskable_icon_x192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "maskable"
            },
            {
                "src": "/maskable_icon_x512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable"
            }
        ],
        "theme_color": "#fff",
        "background_color": "#F6F3EE",
        "display": "standalone",
        "screenshots": [
            {
                "src": "calendar_view.png",
                "sizes": "1442x3202",
                "type": "image/png",
                "form_factor": "narrow",
                "label": "Calendar view"
            },
            {
                "src": "calendar_view_desktop.png",
                "sizes": "2048x1654",
                "type": "image/png",
                "form_factor": "wide",
                "label": "Calendar view"
            }
        ]
    }
}