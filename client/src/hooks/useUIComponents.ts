import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UiComponent, InsertUiComponent } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export function useUIComponents(filters?: {
  category?: string;
  isActive?: boolean;
  isPublic?: boolean;
}) {
  return useQuery({
    queryKey: ['/api/ui-components', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());
      
      return fetch(`/api/ui-components?${params}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch components');
        return res.json();
      });
    },
  });
}

export function useUIComponent(id?: string) {
  return useQuery({
    queryKey: ['/api/ui-components', id],
    queryFn: () => {
      if (!id) throw new Error('Component ID is required');
      return fetch(`/api/ui-components/${id}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch component');
        return res.json();
      });
    },
    enabled: !!id,
  });
}

export function useUIComponentByName(name?: string) {
  return useQuery({
    queryKey: ['/api/ui-components/name', name],
    queryFn: () => {
      if (!name) throw new Error('Component name is required');
      return fetch(`/api/ui-components/name/${name}`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch component');
        return res.json();
      });
    },
    enabled: !!name,
  });
}

export function useCreateUIComponent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (component: InsertUiComponent) => {
      return await apiRequest('/api/ui-components', {
        method: 'POST',
        body: component,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ui-components'] });
    },
  });
}

export function useUpdateUIComponent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, component }: { id: string; component: Partial<InsertUiComponent> }) => {
      return await apiRequest(`/api/ui-components/${id}`, {
        method: 'PUT',
        body: component,
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ui-components'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ui-components', id] });
    },
  });
}

export function useDeleteUIComponent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/ui-components/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ui-components'] });
    },
  });
}

export function useComponentAnalytics(componentId?: string) {
  return useQuery({
    queryKey: ['/api/ui-components', componentId, 'analytics'],
    queryFn: () => {
      if (!componentId) throw new Error('Component ID is required');
      return fetch(`/api/ui-components/${componentId}/analytics`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch analytics');
        return res.json();
      });
    },
    enabled: !!componentId,
  });
}

// Component category helpers
export const COMPONENT_CATEGORIES = {
  CARD: 'card',
  BANNER: 'banner',
  FORM: 'form',
  LAYOUT: 'layout',
  NAVIGATION: 'navigation',
  BUTTON: 'button',
  TEXT: 'text',
  LIST: 'list',
  MEDIA: 'media',
  CUSTOM: 'custom',
} as const;

export const COMPONENT_TYPES = {
  REACT: 'react',
  HTML: 'html',
  CARD: 'card',
  BANNER: 'banner',
  FORM: 'form',
  LIST: 'list',
  CUSTOM: 'custom',
} as const;

// Usage tracking utility
export function trackComponentUsage(componentId: string, page: string, context: Record<string, any> = {}) {
  const startTime = performance.now();
  
  return fetch('/api/ui-components/track-usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      componentId,
      page,
      context,
      performanceMetrics: {
        loadTime: performance.now() - startTime,
        renderTime: 0,
      },
      userAgent: navigator.userAgent,
    }),
  }).catch(error => {
    console.warn('Failed to track component usage:', error);
  });
}