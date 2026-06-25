export const TaskViewService = {
  /**
   * Saves a task view to local storage (Future: backend API)
   * @param {Object} view - The view object containing id, label, icon, filters, and color
   * @returns {Promise<void>}
   */
  saveTaskView: async (view) => {
    // Simulating async behavior for future API migration
    return new Promise((resolve) => {
      const savedViews = TaskViewService.getTaskViewsSync();
      const existingIndex = savedViews.findIndex((v) => v.id === view.id);
      
      if (existingIndex >= 0) {
        savedViews[existingIndex] = { ...savedViews[existingIndex], ...view };
      } else {
        savedViews.push(view);
      }
      
      localStorage.setItem("agricom_saved_task_views", JSON.stringify(savedViews));
      resolve(view);
    });
  },

  /**
   * Retrieves all saved task views
   * @returns {Promise<Array>}
   */
  getTaskViews: async () => {
    return new Promise((resolve) => {
      resolve(TaskViewService.getTaskViewsSync());
    });
  },

  /**
   * Synchronous method for initial render state if needed
   * @returns {Array}
   */
  getTaskViewsSync: () => {
    try {
      const saved = localStorage.getItem("agricom_saved_task_views");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse saved task views from local storage", e);
      return [];
    }
  },

  /**
   * Deletes a saved task view by ID
   * @param {string} id 
   * @returns {Promise<void>}
   */
  deleteTaskView: async (id) => {
    return new Promise((resolve) => {
      const savedViews = TaskViewService.getTaskViewsSync();
      const updatedViews = savedViews.filter((v) => v.id !== id);
      localStorage.setItem("agricom_saved_task_views", JSON.stringify(updatedViews));
      resolve();
    });
  }
};
