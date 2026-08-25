import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QuotationsAPI } from '../api/quotations.api';

export const QUOTATION_QUERY_KEYS = {
  all: ['quotations'],
  list: (params) => ['quotations', 'list', params],
  detail: (id) => ['quotations', 'detail', id],
};

export const useCreateQuotationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: QuotationsAPI.create,
    onSuccess: (data) => {
      toast.success(`Quotation ${data.quotationNumber || ''} created successfully!`);
      queryClient.invalidateQueries({ queryKey: QUOTATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('quotation-created', { detail: data }));
      }
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        'Failed to create quotation';
      toast.error(msg);
    },
  });
};

export const useUpdateQuotationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => QuotationsAPI.update(id, payload),
    onSuccess: (data) => {
      toast.success(`Quotation ${data.quotationNumber || ''} updated`);
      queryClient.invalidateQueries({ queryKey: QUOTATION_QUERY_KEYS.all });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update quotation';
      toast.error(msg);
    },
  });
};
