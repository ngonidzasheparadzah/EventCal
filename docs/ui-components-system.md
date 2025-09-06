# Dynamic UI Components System Documentation

## Overview

The Dynamic UI Components System enables storing, managing, and rendering reusable UI components dynamically from database configurations. This system allows administrators to create, modify, and deploy UI components without requiring code changes or deployments.

## Architecture

### Database Schema

The system uses two main database tables:

#### `ui_components` Table
Stores component definitions and configurations:

```sql
- id: varchar (UUID) - Unique component identifier
- name: varchar (unique) - Machine-readable component name (e.g., "hero-banner-main")
- display_name: varchar - Human-readable component name
- description: text - Component description
- category: varchar - Component category (card, banner, form, etc.)
- component_type: varchar - Rendering type (react, html, custom)
- version: varchar - Semantic version (default: "1.0.0")
- is_active: boolean - Whether component is active
- is_public: boolean - Whether component is publicly available
- config: jsonb - Component configuration and props
- template: text - HTML/JSX template string
- styles: jsonb - CSS styling configuration
- interactions: jsonb - Component behavior and interactions
- responsive: jsonb - Responsive design configurations
- variants: jsonb - A/B testing and component variants
- usage_count: integer - Track component usage
- created_by: varchar - Creator user ID
- updated_by: varchar - Last updater user ID
- tags: jsonb - Categorization tags
- dependencies: jsonb - Required dependencies
- preview_image: varchar - Preview image URL
- created_at: timestamp
- updated_at: timestamp
```

#### `component_usage` Table
Tracks component usage analytics:

```sql
- id: varchar (UUID)
- component_id: varchar - Reference to ui_components
- user_id: varchar - User who triggered usage (nullable)
- page: varchar - Page where component was used
- context: jsonb - Additional context data
- performance_metrics: jsonb - Load time, render time
- user_agent: text - Browser information
- ip_address: varchar - User IP address
- created_at: timestamp
```

### Backend API

The system provides comprehensive REST API endpoints:

#### Component Management
- `GET /api/ui-components` - List components with filters
- `GET /api/ui-components/:id` - Get component by ID
- `GET /api/ui-components/name/:name` - Get component by name
- `POST /api/ui-components` - Create component (admin only)
- `PUT /api/ui-components/:id` - Update component (admin only)
- `DELETE /api/ui-components/:id` - Delete component (admin only)

#### Analytics
- `POST /api/ui-components/track-usage` - Track component usage
- `GET /api/ui-components/:id/analytics` - Get usage analytics (admin only)

### Frontend Components

#### `DynamicComponent`
Main component for rendering dynamic components:

```tsx
import DynamicComponent from '@/components/dynamic/DynamicComponent';

<DynamicComponent
  componentName="hero-banner-main"  // Component name
  data={{ title: "Welcome", description: "..." }}  // Data to inject
  className="custom-class"          // Additional CSS classes
  trackUsage={true}                // Track usage (default: true)
  page="homepage"                   // Page identifier for analytics
  context={{ source: "homepage" }} // Additional context
/>
```

#### `useUIComponents` Hook
React hook for component management:

```tsx
import { useUIComponents, useUIComponent, useCreateUIComponent } from '@/hooks/useUIComponents';

// List components with filters
const { data: components } = useUIComponents({
  category: 'card',
  isActive: true,
  isPublic: true
});

// Get single component
const { data: component } = useUIComponent(componentId);

// Create component (admin only)
const createMutation = useCreateUIComponent();
```

## Component Types

### 1. React Components
Components that render as React elements with configuration-driven props:

```json
{
  "type": "button",
  "label": "{{buttonText}}",
  "variant": "primary",
  "onClick": { "type": "navigate", "url": "/dashboard" }
}
```

### 2. HTML Components
Components using HTML templates with variable substitution:

```html
<div class="hero-banner {{theme}}">
  <h1>{{title}}</h1>
  <p>{{description}}</p>
  <a href="{{ctaUrl}}" class="btn">{{ctaText}}</a>
</div>
```

### 3. Card Components
Pre-configured card layouts:

```json
{
  "title": "{{title}}",
  "description": "{{description}}",
  "image": "{{imageUrl}}",
  "actions": [
    { "label": "Learn More", "onClick": "{{learnMoreUrl}}" }
  ]
}
```

### 4. Banner Components
Alert and notification banners:

```json
{
  "type": "info",
  "title": "{{title}}",
  "message": "{{message}}",
  "icon": "ℹ️",
  "dismissible": true
}
```

### 5. Form Components
Dynamic forms with validation:

```json
{
  "fields": [
    {
      "name": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "Enter your email"
    }
  ],
  "submitButton": { "label": "Submit" }
}
```

### 6. List Components
Dynamic list rendering:

```json
{
  "dataKey": "items",
  "itemTemplate": "<div class=\"item\">{{name}} - {{description}}</div>"
}
```

## Variable Substitution

Components support variable substitution using double curly braces:

```
{{variableName}}           // Simple variable
{{user.firstName}}         // Nested property
{{items.0.title}}          // Array access
```

Data is passed to components via the `data` prop:

```tsx
<DynamicComponent
  componentName="user-profile-card"
  data={{
    user: { firstName: "John", lastName: "Doe" },
    stats: { posts: 15, followers: 120 }
  }}
/>
```

## Component Configuration Examples

### Hero Banner
```json
{
  "name": "hero-banner-main",
  "displayName": "Main Hero Banner",
  "category": "banner",
  "componentType": "react",
  "config": {
    "type": "hero",
    "title": "{{title}}",
    "subtitle": "{{subtitle}}",
    "backgroundImage": "{{bgImage}}",
    "ctaButton": {
      "text": "{{ctaText}}",
      "url": "{{ctaUrl}}"
    }
  },
  "styles": {
    "className": "bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
  },
  "responsive": {
    "mobile": { "className": "py-12 px-4" },
    "desktop": { "className": "py-20 px-8" }
  }
}
```

### Property Card
```json
{
  "name": "property-card-featured",
  "displayName": "Featured Property Card",
  "category": "card",
  "componentType": "card",
  "config": {
    "image": "{{imageUrl}}",
    "title": "{{title}}",
    "description": "{{description}}",
    "price": "{{pricePerNight}}",
    "rating": "{{rating}}",
    "actions": [
      {
        "label": "View Details",
        "variant": "primary",
        "onClick": { "type": "navigate", "url": "/listings/{{id}}" }
      },
      {
        "label": "Add to Wishlist",
        "variant": "secondary",
        "onClick": { "type": "event", "name": "addToWishlist", "data": {"id": "{{id}}"} }
      }
    ]
  }
}
```

### Contact Form
```json
{
  "name": "contact-form-standard",
  "displayName": "Standard Contact Form",
  "category": "form",
  "componentType": "form",
  "config": {
    "fields": [
      {
        "name": "name",
        "type": "text",
        "label": "Full Name",
        "required": true,
        "placeholder": "Enter your full name"
      },
      {
        "name": "email",
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "Enter your email"
      },
      {
        "name": "message",
        "type": "textarea",
        "label": "Message",
        "required": true,
        "placeholder": "Enter your message"
      }
    ],
    "submitButton": {
      "label": "Send Message",
      "loadingText": "Sending..."
    }
  }
}
```

## Admin Interface

The admin interface provides a complete component management system:

### Features
- **Component Library**: Browse all components with filtering by category
- **Visual Editor**: Create and edit components with live preview
- **Version Control**: Track component versions and changes
- **Usage Analytics**: Monitor component performance and usage
- **A/B Testing**: Create component variants for testing
- **Permission Management**: Control component visibility (public/private)

### Access
Admin interface is available at `/admin/components` (admin role required).

## Usage Analytics

The system automatically tracks:
- **Usage Count**: Number of times component is rendered
- **Performance Metrics**: Load time and render time
- **User Analytics**: Unique users and usage patterns
- **Page Analytics**: Where components are most used
- **Device Analytics**: Mobile vs desktop usage

### Analytics API
```javascript
// Get component analytics (admin only)
const analytics = await fetch(`/api/ui-components/${componentId}/analytics`);

// Returns:
{
  "totalUsage": 1250,
  "uniqueUsers": 450,
  "avgPerformance": 125.5,
  "topPages": ["/", "/dashboard", "/listings"],
  "recentUsage": 75
}
```

## Security Considerations

### Access Control
- **Component Creation**: Admin role required
- **Component Editing**: Admin role required
- **Component Deletion**: Admin role required
- **Analytics Access**: Admin role required
- **Public Components**: Available to all users
- **Private Components**: Available only to authenticated users

### Input Sanitization
- JSON configurations are validated on the server
- HTML templates are sanitized to prevent XSS
- Variable substitution uses safe string replacement
- Interactive components have restricted capabilities

### Performance
- Components are cached at the database level
- Usage tracking is asynchronous and non-blocking
- Large components can be lazy-loaded
- Analytics data is aggregated for performance

## Best Practices

### Component Design
1. **Keep components focused**: Each component should have a single responsibility
2. **Use semantic names**: Component names should be descriptive and unique
3. **Version components**: Use semantic versioning for component updates
4. **Document configurations**: Include clear descriptions and examples
5. **Test thoroughly**: Preview components before making them active

### Performance
1. **Optimize configurations**: Keep JSON configurations lightweight
2. **Use caching**: Components are cached automatically
3. **Monitor usage**: Use analytics to identify performance issues
4. **Lazy load**: Large components should support lazy loading

### Security
1. **Validate inputs**: Always validate JSON configurations
2. **Sanitize templates**: HTML templates must be sanitized
3. **Restrict interactions**: Limit component interaction capabilities
4. **Audit changes**: Track all component modifications

### Maintenance
1. **Regular reviews**: Periodically review component usage and performance
2. **Clean up unused**: Remove components with zero usage
3. **Update versions**: Keep component versions current
4. **Monitor errors**: Track component rendering errors

## Migration and Deployment

### Database Migration
The component system requires running database migrations:

```bash
npm run db:push
```

### Component Deployment
Components are deployed instantly when created or updated through the admin interface. No application restart required.

### Backup and Recovery
Component configurations should be backed up regularly as part of database backups. Export/import functionality can be added for component migration between environments.

## Troubleshooting

### Common Issues

#### Component Not Rendering
1. Check component `isActive` status
2. Verify component configuration JSON is valid
3. Check browser console for JavaScript errors
4. Ensure all required data is provided

#### Variable Substitution Not Working
1. Verify variable names match data properties exactly
2. Check for typos in variable syntax `{{variableName}}`
3. Ensure data is passed correctly to component

#### Performance Issues
1. Check component analytics for usage patterns
2. Optimize large JSON configurations
3. Consider breaking large components into smaller ones
4. Enable caching where appropriate

#### Admin Interface Access
1. Verify user has admin role
2. Check authentication status
3. Ensure proper permissions are set

### Debugging

Enable debug mode for detailed component rendering information:

```tsx
<DynamicComponent
  componentName="my-component"
  data={debugData}
  trackUsage={false}  // Disable for debugging
  page="debug"
/>
```

Check browser console for component rendering details and error messages.

## API Reference

### Component Object Structure
```typescript
interface UiComponent {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  category: string;
  componentType: string;
  version: string;
  isActive: boolean;
  isPublic: boolean;
  config: Record<string, any>;
  template?: string;
  styles: Record<string, any>;
  interactions: Record<string, any>;
  responsive: Record<string, any>;
  variants: any[];
  usageCount: number;
  createdBy?: string;
  updatedBy?: string;
  tags: string[];
  dependencies: string[];
  previewImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Component Configuration Schema
```typescript
interface ComponentConfig {
  // Component-specific configuration
  type?: string;
  title?: string;
  description?: string;
  image?: string;
  
  // Interactive elements
  actions?: Array<{
    label: string;
    variant?: 'primary' | 'secondary';
    onClick?: string | InteractionConfig;
  }>;
  
  // Form-specific
  fields?: Array<{
    name: string;
    type: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
  }>;
  
  // List-specific
  dataKey?: string;
  itemTemplate?: string;
  
  // Styling
  className?: string;
  theme?: string;
}
```

## Conclusion

The Dynamic UI Components System provides a powerful, flexible way to manage and deploy UI components without code changes. It combines the benefits of component-based architecture with the flexibility of database-driven configuration, enabling rapid iteration and testing of UI elements.

For additional support or feature requests, please refer to the development team or create an issue in the project repository.