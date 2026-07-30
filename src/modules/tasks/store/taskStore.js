import { create } from 'zustand';

/**
 * Global Zustand Store for Task Module UI State.
 * Handles view types, selected task context, global filters, and modal states.
 */
export const useTaskStore = create((set) => ({
  // Active View & Preset
  activeView: 'list', // 'list' | 'kanban' | 'calendar'
  preset: 'all_tasks',

  // Task Context
  selectedTaskId: null,
  isTaskDrawerOpen: false, // Right side preview drawer
  isCreateTaskDrawerOpen: false, // Right side create task drawer
  createDrawerMode: 'create', // 'create' | 'edit'
  createDrawerTaskId: null, // task ID when in edit mode
  isFilterDrawerOpen: false, // Right side advanced filters
  isSelectAllActive: false, // Whitelist vs Blacklist mode
  selectedRowIds: new Set(), // Set of selected Task IDs
  scrollTop: 0, // Scroll coordinates memory
  scrollCursor: null, // Scroll position marker cursor
  firstVisibleRowId: null, // Scroll position marker row ID

  // Global Filters
  filters: {
    search: '',
    statusIds: [],
    priorityIds: [],
    assigneeIds: [],
    dueDateStart: null,
    dueDateEnd: null,
  },

  // Pagination (Table State)
  pagination: {
    page: 1,
    limit: 50,
  },

  // Actions - Views
  setActiveView: (view) => set({ activeView: view }),
  setPreset: (preset) => set({ preset, isSelectAllActive: false, selectedRowIds: new Set() }),

  // Actions - Context
  setSelectedTask: (taskId) => set({ 
    selectedTaskId: taskId, 
    isTaskDrawerOpen: !!taskId 
  }),
  setSelectedRowIds: (rowIdsOrUpdater) => set((state) => ({
    selectedRowIds: typeof rowIdsOrUpdater === 'function'
      ? rowIdsOrUpdater(state.selectedRowIds)
      : rowIdsOrUpdater
  })),
  setIsSelectAllActive: (active) => set({ isSelectAllActive: active }),
  setScrollState: (scrollTop, scrollCursor = null, firstVisibleRowId = null) => set({
    scrollTop,
    scrollCursor,
    firstVisibleRowId
  }),
  closeTaskDrawer: () => set({ 
    selectedTaskId: null, 
    isTaskDrawerOpen: false 
  }),
  openCreateTaskDrawer: (taskId = null) => set({ 
    isCreateTaskDrawerOpen: true,
    createDrawerMode: taskId ? 'edit' : 'create',
    createDrawerTaskId: taskId
  }),
  closeCreateTaskDrawer: () => set({ 
    isCreateTaskDrawerOpen: false,
    createDrawerMode: 'create',
    createDrawerTaskId: null
  }),
  toggleFilterDrawer: () => set((state) => ({ 
    isFilterDrawerOpen: !state.isFilterDrawerOpen 
  })),
  closeFilterDrawer: () => set({ 
    isFilterDrawerOpen: false 
  }),

  // Actions - Filters
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    pagination: { ...state.pagination, page: 1 },
    isSelectAllActive: false,
    selectedRowIds: new Set(),
  })),
  clearFilters: () => set((state) => ({
    filters: {
      search: '',
      statusIds: [],
      priorityIds: [],
      assigneeIds: [],
      dueDateStart: null,
      dueDateEnd: null,
    },
    pagination: { ...state.pagination, page: 1 },
    isSelectAllActive: false,
    selectedRowIds: new Set(),
  })),

  // Actions - Pagination
  setPagination: (newPagination) => set((state) => ({
    pagination: { ...state.pagination, ...newPagination }
  })),
}));
