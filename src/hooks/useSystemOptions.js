import { useState, useEffect } from 'react';
import axiosClient from '@/lib/axios';

export default function useSystemOptions() {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const cachedOptions = sessionStorage.getItem('systemOptions');
        if (cachedOptions) {
          setOptions(JSON.parse(cachedOptions));
          setLoading(false);
          return;
        }

        const res = await axiosClient.get('/system/options/all');
        const data = res.data;
        
        sessionStorage.setItem('systemOptions', JSON.stringify(data));
        setOptions(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch system options:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return { options, loading, error };
}
