import AppLogoIcon from './app-logo-icon';
import { usePage } from '@inertiajs/react';

import logoPng from '@/assets/TFI-Logo.png';

export default function AppLogo() {
    const { name } = usePage().props as unknown as { name: string };
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden">
                <img
                    src={logoPng}
                    alt="App Logo"
                    className="size-9 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
