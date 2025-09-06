import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UiComponent } from '@shared/schema';
import { cn } from '@/lib/utils';

interface DynamicComponentProps {
  componentName?: string;
  componentId?: string;
  data?: any;
  className?: string;
  trackUsage?: boolean;
  page?: string;
  context?: Record<string, any>;
}

export function DynamicComponent({
  componentName,
  componentId,
  data = {},
  className,
  trackUsage = true,
  page = 'unknown',
  context = {},
}: DynamicComponentProps) {
  const [renderError, setRenderError] = useState<string | null>(null);

  // Fetch component by name or ID
  const { data: component, isLoading, error } = useQuery({
    queryKey: componentName ? ['/api/ui-components/name', componentName] : ['/api/ui-components', componentId],
    enabled: !!(componentName || componentId),
  });

  // Track component usage
  useEffect(() => {
    if (component && trackUsage) {
      trackComponentUsage();
    }
  }, [component?.id, page]);

  const trackComponentUsage = async () => {
    try {
      const startTime = performance.now();
      
      await fetch('/api/ui-components/track-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: component.id,
          page,
          context,
          performanceMetrics: {
            loadTime: performance.now() - startTime,
            renderTime: 0, // Will be updated after render
          },
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.warn('Failed to track component usage:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 rounded-md" 
           data-testid={`loading-component-${componentName || componentId}`}>
        <span className="sr-only">Loading component...</span>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-md"
           data-testid={`error-component-${componentName || componentId}`}>
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load component: {componentName || componentId}
        </p>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {error.message}
          </p>
        )}
      </div>
    );
  }

  if (!component.isActive) {
    return null; // Don't render inactive components
  }

  try {
    return (
      <div 
        className={cn("dynamic-component", className)}
        data-testid={`component-${component.name}`}
        data-component-id={component.id}
        data-component-name={component.name}
      >
        {renderComponent(component, data)}
      </div>
    );
  } catch (error) {
    console.error('Component render error:', error);
    setRenderError(error instanceof Error ? error.message : 'Unknown render error');
    
    return (
      <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-md"
           data-testid={`render-error-${component.name}`}>
        <p className="text-sm text-red-600 dark:text-red-400">
          Component render error: {component.displayName}
        </p>
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
          {renderError}
        </p>
      </div>
    );
  }
}

function renderComponent(component: UiComponent, data: any) {
  const { config, styles, responsive, interactions } = component;

  switch (component.componentType) {
    case 'react':
      return renderReactComponent(component, data);
    case 'html':
      return renderHTMLComponent(component, data);
    case 'card':
      return renderCardComponent(component, data);
    case 'banner':
      return renderBannerComponent(component, data);
    case 'form':
      return renderFormComponent(component, data);
    case 'list':
      return renderListComponent(component, data);
    case 'custom':
      return renderCustomComponent(component, data);
    default:
      return renderDefaultComponent(component, data);
  }
}

function renderReactComponent(component: UiComponent, data: any) {
  // For React components, we would need to evaluate JSX safely
  // This is a simplified version - in production, you'd use a safe JSX evaluator
  const { config } = component;
  
  if (config.type === 'button') {
    return (
      <button
        className={cn(
          "px-4 py-2 rounded-md font-medium transition-colors",
          config.variant === 'primary' ? "bg-blue-600 text-white hover:bg-blue-700" :
          config.variant === 'secondary' ? "bg-gray-200 text-gray-900 hover:bg-gray-300" :
          "bg-transparent border border-gray-300 hover:bg-gray-50",
          config.className
        )}
        onClick={() => handleInteraction(component.interactions?.onClick, data)}
        data-testid={`button-${config.label?.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {replaceVariables(config.label || 'Button', data)}
      </button>
    );
  }

  if (config.type === 'text') {
    const Tag = config.tag || 'p';
    return React.createElement(Tag, {
      className: cn(config.className),
      dangerouslySetInnerHTML: { __html: replaceVariables(config.content || '', data) },
      'data-testid': `text-${config.type}`
    });
  }

  return (
    <div className={cn("p-4 border rounded-md", config.className)}
         data-testid={`react-component-${component.name}`}>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        React Component: {component.displayName}
      </p>
      <pre className="text-xs mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  );
}

function renderHTMLComponent(component: UiComponent, data: any) {
  if (!component.template) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md"
           data-testid={`missing-template-${component.name}`}>
        <p className="text-sm text-yellow-600">No template defined for component</p>
      </div>
    );
  }

  const processedHTML = replaceVariables(component.template, data);
  
  return (
    <div
      className={cn("html-component", component.styles?.className)}
      dangerouslySetInnerHTML={{ __html: processedHTML }}
      data-testid={`html-component-${component.name}`}
    />
  );
}

function renderCardComponent(component: UiComponent, data: any) {
  const { config } = component;
  
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm",
      config.className
    )}
    data-testid={`card-${component.name}`}>
      {config.image && (
        <img
          src={replaceVariables(config.image, data)}
          alt={replaceVariables(config.imageAlt || '', data)}
          className="w-full h-48 object-cover"
          data-testid="card-image"
        />
      )}
      <div className="p-6">
        {config.title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
              data-testid="card-title">
            {replaceVariables(config.title, data)}
          </h3>
        )}
        {config.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4"
             data-testid="card-description">
            {replaceVariables(config.description, data)}
          </p>
        )}
        {config.actions && config.actions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {config.actions.map((action: any, index: number) => (
              <button
                key={index}
                className={cn(
                  "px-3 py-1 rounded text-sm font-medium transition-colors",
                  action.variant === 'primary' ? "bg-blue-600 text-white hover:bg-blue-700" :
                  "bg-gray-200 text-gray-900 hover:bg-gray-300"
                )}
                onClick={() => handleInteraction(action.onClick, data)}
                data-testid={`card-action-${index}`}
              >
                {replaceVariables(action.label, data)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderBannerComponent(component: UiComponent, data: any) {
  const { config } = component;
  
  return (
    <div className={cn(
      "p-4 rounded-md border-l-4",
      config.type === 'info' ? "bg-blue-50 border-blue-400 dark:bg-blue-900/20 dark:border-blue-400" :
      config.type === 'success' ? "bg-green-50 border-green-400 dark:bg-green-900/20 dark:border-green-400" :
      config.type === 'warning' ? "bg-yellow-50 border-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-400" :
      config.type === 'error' ? "bg-red-50 border-red-400 dark:bg-red-900/20 dark:border-red-400" :
      "bg-gray-50 border-gray-400 dark:bg-gray-900/20 dark:border-gray-400",
      config.className
    )}
    data-testid={`banner-${component.name}`}>
      <div className="flex items-start">
        {config.icon && (
          <div className="flex-shrink-0 mr-3"
               data-testid="banner-icon">
            <span className="text-lg">{config.icon}</span>
          </div>
        )}
        <div className="flex-1">
          {config.title && (
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1"
                data-testid="banner-title">
              {replaceVariables(config.title, data)}
            </h4>
          )}
          {config.message && (
            <p className="text-sm text-gray-700 dark:text-gray-300"
               data-testid="banner-message">
              {replaceVariables(config.message, data)}
            </p>
          )}
        </div>
        {config.dismissible && (
          <button
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={() => handleInteraction(config.onDismiss, data)}
            data-testid="banner-dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function renderFormComponent(component: UiComponent, data: any) {
  const { config } = component;
  
  return (
    <form className={cn("space-y-4", config.className)}
          data-testid={`form-${component.name}`}>
      {config.fields?.map((field: any, index: number) => (
        <div key={index} className="space-y-1">
          {field.label && (
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                   data-testid={`field-label-${field.name}`}>
              {replaceVariables(field.label, data)}
            </label>
          )}
          <input
            type={field.type || 'text'}
            name={field.name}
            placeholder={replaceVariables(field.placeholder || '', data)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            data-testid={`field-input-${field.name}`}
          />
        </div>
      ))}
      {config.submitButton && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="form-submit"
        >
          {replaceVariables(config.submitButton.label || 'Submit', data)}
        </button>
      )}
    </form>
  );
}

function renderListComponent(component: UiComponent, data: any) {
  const { config } = component;
  const items = data[config.dataKey] || config.items || [];
  
  return (
    <ul className={cn("space-y-2", config.className)}
        data-testid={`list-${component.name}`}>
      {items.map((item: any, index: number) => (
        <li key={index} 
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-md"
            data-testid={`list-item-${index}`}>
          {typeof item === 'string' ? item : (
            <div>
              {config.itemTemplate ? 
                replaceVariables(config.itemTemplate, item) :
                JSON.stringify(item)
              }
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function renderCustomComponent(component: UiComponent, data: any) {
  // Handle custom component types with specific logic
  return (
    <div className={cn("custom-component p-4 border rounded-md", component.styles?.className)}
         data-testid={`custom-${component.name}`}>
      <h4 className="font-medium mb-2">{component.displayName}</h4>
      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
        {JSON.stringify({ config: component.config, data }, null, 2)}
      </pre>
    </div>
  );
}

function renderDefaultComponent(component: UiComponent, data: any) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md"
         data-testid={`default-${component.name}`}>
      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
        {component.displayName}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {component.description}
      </p>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Type: {component.componentType} | Category: {component.category}
      </div>
    </div>
  );
}

// Utility functions
function replaceVariables(template: string, data: any): string {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
    const value = getNestedProperty(data, path);
    return value !== undefined ? String(value) : match;
  });
}

function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function handleInteraction(interaction: any, data: any) {
  if (!interaction) return;
  
  try {
    if (typeof interaction === 'string') {
      // Handle simple URL redirects
      if (interaction.startsWith('http') || interaction.startsWith('/')) {
        window.location.href = replaceVariables(interaction, data);
        return;
      }
      
      // Handle simple JavaScript expressions (be very careful with this)
      console.log('Interaction:', interaction);
    } else if (interaction.type === 'navigate') {
      window.location.href = replaceVariables(interaction.url, data);
    } else if (interaction.type === 'event') {
      // Dispatch custom events
      window.dispatchEvent(new CustomEvent(interaction.name, { detail: data }));
    }
  } catch (error) {
    console.error('Interaction error:', error);
  }
}

export default DynamicComponent;