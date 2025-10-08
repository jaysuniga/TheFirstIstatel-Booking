import { useCallback } from 'react';

export function useInitials() {
  return useCallback((firstName?: string, lastName?: string): string => {
    if (!firstName && !lastName) return '';

    const firstInitial = firstName?.charAt(0)?.toUpperCase() ?? '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() ?? '';

    return `${firstInitial}${lastInitial}`.trim();
  }, []);
}
