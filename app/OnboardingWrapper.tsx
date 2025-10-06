'use client';

import { useEffect } from 'react';
import { NextStep, NextStepProvider, Step, Tour, useNextStep } from 'nextstepjs';
import { useRouter } from 'next/navigation';
import { useAppSession } from '@/lib/hooks';
import { isMobile } from '@/lib/responsiveUtils';

const DEFAULT_STEPS: Step[] = [
    {
        title: "Welcome to SF Social Club",
        icon: "🎉",
        content: "Here you'll find upcoming events you're hosting and more",
        side: 'top-left',
        selector: '#homeBtn',
        prevRoute: '/home',
        nextRoute: '/qr',
        showControls: true,
    },
    {
        title: "Check into Events",
        content: "Show your QR code to the event host",
        icon: null,
        selector: '#qrBtn',
        side: 'top',
        nextRoute: '/calendar',
        prevRoute: '/home',
        showControls: true,
    },
    {
        title: "See upcoming Events",
        content: "Check back in regularly to see what's happening",
        icon: null,
        selector: '#calendarBtn',
        side: 'top-right',
        prevRoute: '/qr',
        nextRoute: '/help',
        showControls: true,
    },
    {
        title: "That's all!",
        icon: "🎊",
        content: <p>Follow the guide to <span className="font-extrabold">Add to Home screen</span> or repeat this tour at anytime from the Help page</p>,
        prevRoute: '/calendar',
        showControls: true
    },
]

const STEPS: Tour[] = [
    {
        tour: "mobileOnboarding",
        steps: DEFAULT_STEPS
    },
    {
        tour: "desktopOnboarding",
        steps: [
            {
                ...DEFAULT_STEPS[0],
                selector: '#desktopHomeBtn',
                side:'bottom'
            },
            {
                ...DEFAULT_STEPS[1],
                selector: '#desktopQrBtn',
                side: 'bottom',
            },
            {
                ...DEFAULT_STEPS[2],
                selector: '#desktopCalendarBtn',
                side: 'bottom',
            }
        ]
    }
]



function hasUserCompletedOnboarding() {
    return localStorage.getItem(isMobile() ? 'onboarding_mobile_complete' : 'onboarding_desktop_complete') === 'true';
}


const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const session = useAppSession();
    const { startNextStep } = useNextStep();
    const router = useRouter();

    useEffect(() => {
        // Start the onboarding tour for new users
        if (!hasUserCompletedOnboarding() && session) {
            router.push('/home');
            setTimeout(() => {
                startNextStep(isMobile() ? 'mobileOnboarding' : 'desktopOnboarding');
            }, 1000)
        }
    }, [startNextStep, session]);

    return (<>{children}</>);
}

export function OnboardingWrapper({ children }: { children: React.ReactNode }) {

    function completeOnboardingTour(tourName: string | null) {
        localStorage.setItem(isMobile() ? 'onboarding_mobile_complete' : 'onboarding_desktop_complete', 'true');
    }

    function handleStepChange(step: number, tourName: string | null) {
        if (step === STEPS.filter(tour => tour.tour === tourName)[0].steps.length - 1) {
            completeOnboardingTour(tourName);
        }
    }

    return (
        <NextStepProvider>
            <NextStep steps={STEPS}
                onStepChange={handleStepChange}
                onComplete={(tourName) => completeOnboardingTour(tourName)}
            >
                <Wrapper>{children}</Wrapper>
            </NextStep>
        </NextStepProvider>
    );
}