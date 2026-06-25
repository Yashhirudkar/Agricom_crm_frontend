import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';

/**
 * Custom hook to handle global keyboard shortcuts.
 */
export function useKeyboardShortcuts() {
  const { 
    isTaskDrawerOpen, 
    closeTaskDrawer, 
    isFilterDrawerOpen, 
    closeFilterDrawer,
    toggleFilterDrawer
  } = useTaskStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea
      const activeTag = document.activeElement.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement.isContentEditable) {
        // Exception: Esc should blur input or close drawers
        if (e.key === 'Escape') {
          document.activeElement.blur();
        } else {
          return;
        }
      }

      switch (e.key) {
        case '/':
          e.preventDefault();
          const searchInput = document.getElementById('task-global-search');
          if (searchInput) {
            searchInput.focus();
          }
          break;
        
        case 'Escape':
          e.preventDefault();
          if (isTaskDrawerOpen) closeTaskDrawer();
          else if (isFilterDrawerOpen) closeFilterDrawer();
          // To clear table selection, it needs table instance access (usually handled inside table component)
          break;

        case 'F':
        case 'f':
          if (e.shiftKey) {
            e.preventDefault();
            toggleFilterDrawer();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskDrawerOpen, isFilterDrawerOpen, closeTaskDrawer, closeFilterDrawer, toggleFilterDrawer]);
}
