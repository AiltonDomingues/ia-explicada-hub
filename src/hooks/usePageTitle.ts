import { useEffect } from "react";

/**
 * Hook to dynamically set the page title
 * @param title - The title to set for the current page
 */
export const usePageTitle = (title: string) => {
  useEffect(() => {
    const baseTitle = "IA Explicada HUB";
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // Cleanup: reset to base title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};
