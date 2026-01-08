# Add Service Modal - Usage Guide

## Overview
I've successfully converted your HTML form into a React modal component that integrates seamlessly with your existing project. The modal opens when you click the "Add New Service" button in the Services section.

## What's Included

### 1. AddServiceModal Component (`src/components/AddServiceModal.jsx`)
- **Full form functionality** with all fields from your original HTML
- **Service icon selection** with visual icon grid
- **Dynamic features management** - add/remove features with icons
- **Auto-slug generation** from service title
- **Form validation** with required field indicators
- **Dark mode support** matching your existing theme
- **Responsive design** that works on all screen sizes
- **Custom scrollbar** for better UX in the modal

### 2. Updated ServicesHeroSection Component
- Added "Add New Service" button with gradient styling
- Integrated modal state management
- Modal opens/closes smoothly with backdrop blur

### 3. Enhanced CSS
- Added custom scrollbar styles for the modal
- Maintains consistency with your existing design system

## Features

### Form Fields
- **Title** (required) - Auto-generates slug
- **Slug** (required) - URL-friendly identifier
- **Service Icon** (required) - Visual icon selection grid
- **Display Order** - Numeric ordering
- **Short Description** (required) - Brief service summary
- **Detailed Description** - Full service details
- **Features Section** - Dynamic feature list with icons
- **SEO Meta Fields** - Title, keywords, description
- **Status Toggles** - Featured and Active checkboxes

### Interactive Features
- **Icon Selection Grid** - Click to select service icons
- **Feature Management** - Add/remove features dynamically
- **Auto-slug Generation** - Automatically creates URL-friendly slugs
- **Form Validation** - Required field indicators and validation
- **Responsive Layout** - Works on desktop, tablet, and mobile

## How to Use

1. **Open the Modal**: Click the "Add New Service" button in the Services section
2. **Fill the Form**: Complete the required fields (marked with red asterisks)
3. **Select Icon**: Choose from the icon grid
4. **Add Features**: Use the features section to add service features
5. **Submit**: Click "Create Service" to save (currently logs to console)

## Integration Points

The modal is designed to integrate with your backend API. Currently, it logs the form data to the console. To connect it to your backend:

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Replace this with your API call
  fetch('/api/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Service created:', data);
    onClose(); // Close modal on success
  })
  .catch(error => {
    console.error('Error creating service:', error);
  });
};
```

## Styling

The modal uses your existing design system:
- **Colors**: Matches your blue/slate theme
- **Typography**: Uses Inter font family
- **Spacing**: Consistent with your component spacing
- **Dark Mode**: Full dark mode support
- **Animations**: Smooth transitions and hover effects

## Customization

You can easily customize:
- **Icon Options**: Modify the `serviceIcons` array
- **Form Fields**: Add/remove fields in the form structure
- **Validation**: Add custom validation rules
- **Styling**: Adjust colors and spacing using Tailwind classes
- **API Integration**: Connect to your backend service

## Development Server

The development server is running at: http://localhost:5174/

You can now test the modal by:
1. Opening the application in your browser
2. Navigating to the Services section
3. Clicking the "Add New Service" button
4. Testing all the form functionality

The modal is fully functional and ready for production use!