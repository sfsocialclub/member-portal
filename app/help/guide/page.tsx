'use client';

import { isMobile } from "@/lib/responsiveUtils";
import { useRouter } from "next/navigation";
import { useNextStep } from "nextstepjs";
import { useEffect } from "react";

const GuidePage = () => {
    const router = useRouter();
    const { startNextStep } = useNextStep();

    useEffect(() => {
        router.push('/home');
        startNextStep(isMobile() ? 'mobileOnboarding' : 'desktopOnboarding');
    }, [startNextStep]);

    return null
}

export default GuidePage;