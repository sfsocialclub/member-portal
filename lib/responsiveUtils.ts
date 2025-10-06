export const isMobile = () => {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ];

    return window.innerWidth < 1024 || toMatch.some((regex) => navigator.userAgent.match(regex));
}

export const isDesktop = () => !isMobile();

