# Dynamic UI Components - Quick Start Guide

## What is the Dynamic UI Components System?

The Dynamic UI Components System allows you to create, store, and render reusable UI components from database configurations without needing to write code or deploy updates. Perfect for:

- Creating reusable page sections
- A/B testing different designs
- Rapid content management
- Non-technical content updates

## Basic Usage

### 1. Using an Existing Component

```tsx
import DynamicComponent from '@/components/dynamic/DynamicComponent';

// Render a component by name
<DynamicComponent 
  componentName="hero-banner-main"
  data={{
    title: "Welcome to RooMe",
    subtitle: "Find your perfect accommodation in Zimbabwe",
    ctaText: "Start Searching",
    ctaUrl: "/search"
  }}
/>
```

### 2. Creating Your First Component (Admin Only)

1. **Access Admin Interface**: Navigate to `/admin/components`
2. **Click "Create Component"**
3. **Fill Basic Information**:
   - Name: `welcome-banner` (unique identifier)
   - Display Name: `Welcome Banner`
   - Description: `Main welcome banner for homepage`
   - Category: `banner`
   - Type: `banner`

4. **Configure Component**:
```json
{
  "type": "info",
  "title": "{{title}}",
  "message": "{{message}}",
  "icon": "🏠",
  "dismissible": false
}
```

5. **Save and Preview**

### 3. Using Your Component

```tsx
<DynamicComponent 
  componentName="welcome-banner"
  data={{
    title: "Welcome to RooMe Zimbabwe",
    message: "Discover amazing accommodations across Zimbabwe"
  }}
  page="homepage"
/>
```

## Common Component Types

### Hero Banner
```json
{
  "type": "hero",
  "title": "{{title}}",
  "subtitle": "{{subtitle}}",
  "backgroundImage": "{{bgImage}}",
  "ctaButton": {
    "text": "{{ctaText}}",
    "url": "{{ctaUrl}}"
  }
}
```

Usage:
```tsx
<DynamicComponent 
  componentName="hero-main"
  data={{
    title: "Find Your Home Away From Home",
    subtitle: "Comfortable accommodations across Zimbabwe",
    bgImage: "/images/hero-bg.jpg",
    ctaText: "Start Exploring",
    ctaUrl: "/listings"
  }}
/>
```

### Property Card
```json
{
  "title": "{{title}}",
  "description": "{{description}}",
  "image": "{{imageUrl}}",
  "price": "${{price}} per night",
  "rating": "{{rating}}⭐",
  "actions": [
    {
      "label": "View Details",
      "variant": "primary",
      "onClick": "/listings/{{id}}"
    }
  ]
}
```

Usage:
```tsx
<DynamicComponent 
  componentName="property-card"
  data={{
    id: "123",
    title: "Cozy Apartment in Harare",
    description: "Beautiful 2-bedroom apartment in the city center",
    imageUrl: "/images/property-123.jpg",
    price: 45,
    rating: 4.8
  }}
/>
```

### Information Banner
```json
{
  "type": "info",
  "title": "{{title}}",
  "message": "{{message}}",
  "icon": "ℹ️",
  "dismissible": true
}
```

Usage:
```tsx
<DynamicComponent 
  componentName="info-banner"
  data={{
    title: "New Feature Available",
    message: "You can now filter properties by amenities!"
  }}
/>
```

## Variable Substitution

Components use `{{variableName}}` for dynamic content:

```tsx
// Data object
const data = {
  user: { name: "John", location: "Harare" },
  stats: { bookings: 5, reviews: 12 }
};

// In component config
{
  "greeting": "Hello {{user.name}}!",
  "location": "Located in {{user.location}}",
  "stats": "{{stats.bookings}} bookings, {{stats.reviews}} reviews"
}
```

## Real-World Examples

### Homepage Hero Section
```tsx
<DynamicComponent 
  componentName="homepage-hero"
  data={{
    title: "Experience Zimbabwe's Best Accommodations",
    subtitle: "From city apartments to safari lodges",
    searchPlaceholder: "Where do you want to stay?",
    featuredCount: "500+ properties"
  }}
  page="homepage"
/>
```

### Property Listing Card
```tsx
{properties.map(property => (
  <DynamicComponent 
    key={property.id}
    componentName="property-listing-card"
    data={property}
    context={{ source: "search-results" }}
  />
))}
```

### Contact Form
```tsx
<DynamicComponent 
  componentName="contact-form"
  data={{
    title: "Get in Touch",
    submitText: "Send Message",
    successMessage: "Thank you! We'll get back to you soon."
  }}
  page="contact"
/>
```

## Tips for Success

### Component Design
1. **Keep it simple**: Start with basic components and add complexity gradually
2. **Use clear names**: Component names should be descriptive (`hero-homepage`, not `comp1`)
3. **Test thoroughly**: Always preview components before making them active
4. **Document variables**: List all variables your component expects

### Data Management
1. **Consistent naming**: Use consistent property names across similar components
2. **Default values**: Handle missing data gracefully
3. **Type safety**: Validate data types when possible

### Performance
1. **Monitor usage**: Check analytics to see which components are most used
2. **Optimize configs**: Keep JSON configurations lightweight
3. **Cache wisely**: Components are cached automatically

## Troubleshooting

### Component Not Showing
- Check if component is marked as "Active"
- Verify component name spelling
- Check browser console for errors

### Variables Not Working
- Ensure variable names match data properties exactly: `{{title}}` needs `data.title`
- Check for typos in curly braces
- Verify data is being passed to component

### Styling Issues
- Components inherit parent styles
- Use the `className` prop to add custom styles
- Check responsive configuration for mobile devices

## Next Steps

1. **Explore Examples**: Check existing components in the admin interface
2. **Create Simple Components**: Start with banners and cards
3. **Learn Analytics**: Monitor component performance
4. **Advanced Features**: Explore variants and A/B testing

## Need Help?

- **Documentation**: See full documentation in `docs/ui-components-system.md`
- **Admin Interface**: Access component management at `/admin/components`
- **Support**: Contact the development team for assistance

---

*This quick start guide covers the basics. For advanced features like component variants, analytics, and custom interactions, refer to the complete documentation.*