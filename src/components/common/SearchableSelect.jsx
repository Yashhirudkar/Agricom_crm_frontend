import { useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import axiosClient from '@/lib/axios';

/**
 * Reusable Async Select component for lazy loading dropdown options from the backend.
 * 
 * @param {string} endpoint - The backend API endpoint to fetch options from (e.g., '/employees/options')
 * @param {string|number|object} value - The currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text
 * @param {boolean} isMulti - Whether multi-select is enabled
 * @param {boolean} isClearable - Whether the selection can be cleared
 * @param {object} additionalParams - Additional query parameters to pass to the API
 */
const SearchableSelect = ({
  endpoint,
  value,
  onChange,
  placeholder = 'Search...',
  isMulti = false,
  isClearable = true,
  additionalParams = {},
  className = '',
  disabled = false,
}) => {
  const loadOptions = useCallback(async (inputValue) => {
    try {
      const response = await axiosClient.get(endpoint, {
        params: {
          search: inputValue,
          limit: 20,
          page: 1,
          ...additionalParams,
        },
      });

      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(`Error loading options from ${endpoint}:`, error);
      return [];
    }
  }, [endpoint, additionalParams]);

  // Handle styles to match existing app theme
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? '#007aff' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(0, 122, 255, 0.2)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '&:hover': {
        borderColor: state.isFocused ? '#007aff' : '#d1d5db'
      },
      fontSize: '0.875rem',
      color: '#4b5563',
      backgroundColor: disabled ? '#f9fafb' : '#ffffff',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '0.875rem',
      backgroundColor: state.isSelected ? '#007aff' : state.isFocused ? '#f3f4f6' : 'transparent',
      color: state.isSelected ? 'white' : '#4b5563',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#007aff',
        color: 'white'
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#4b5563'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af'
    }),
    input: (base) => ({
      ...base,
      color: '#4b5563',
      margin: 0,
      padding: 0
    })
  };

  return (
    <div className={`relative ${className}`}>
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable={isClearable}
        styles={customStyles}
        isDisabled={disabled}
        noOptionsMessage={() => "No results found"}
        loadingMessage={() => "Loading..."}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        menuPlacement="auto"
      />
    </div>
  );
};

export default SearchableSelect;
