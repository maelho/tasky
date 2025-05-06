import { dark, experimental__simple } from '@clerk/themes'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

export function useClerkAppearance() {
  const { theme } = useTheme()

  return useMemo(() => {
    const commonStyles = {
      backgroundColor: theme === 'dark' ? '#1A202C' : '#FFFFFF',
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
    }

    return {
      baseTheme: theme === 'dark' ? dark : experimental__simple,
      elements: {
        organizationSwitcherTrigger: {
          ...commonStyles,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        userButtonPopoverCard: commonStyles,
      },
    }
  }, [theme])
}
