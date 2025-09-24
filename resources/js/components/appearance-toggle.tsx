import {useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggle(
    props: HTMLAttributes<HTMLDivElement>
) {
    const { appearance, updateAppearance } = useAppearance();

    // Toggle between light and dark modes when the button is clicked
    const handleToggle = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div>
            {/* Button to toggle between light and dark modes */}
            <button 
            onClick={handleToggle} 
            aria-label="Toggle dark/light mode"
            className="inline-flex items-center p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full transition-transform duration-300"
            >
                <div className='relative w-3 h-3'>
                        <Sun
                        size={15}
                        className={`
                            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                            transition-all duration-500
                            ${appearance === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-360'}
                        `}
                        />

                        <Moon
                        size={15}
                        className={`
                            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                            transition-all duration-500
                            ${appearance === 'dark' ? 'opacity-100 rotate-360' : 'opacity-0 rotate-0'}
                        `}
                        />
                </div>
            </button>
        </div>
    );
}
