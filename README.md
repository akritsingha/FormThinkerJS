# FormThinkerJS

A powerful React component library for generating interactive forms based on schema definitions. FormThinkerJS provides a flexible and customizable way to create dynamic forms with built-in Tailwind CSS styling.

## Features

- 🚀 **Schema-driven**: Generate forms from JSON schema definitions
- 🎨 **Tailwind CSS**: Beautiful, responsive design out of the box
- 🔧 **Customizable**: Extensive customization options
- 📱 **Responsive**: Mobile-first design approach
- 🎯 **JavaScript**: Pure JavaScript implementation
- ⚡ **Performance**: Optimized with React lazy loading
- 🧩 **Modular**: Use individual components or the complete form builder

## Installation

```bash
npm install formthinkerjs
```

## Quick Start

```jsx
import React, { useState } from 'react';
import { FormThinker } from 'formthinkerjs';

function App() {
  const [formData, setFormData] = useState({});
  
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Full Name',
        required: true
      },
      email: {
        type: 'string',
        title: 'Email Address',
        format: 'email',
        required: true
      },
      age: {
        type: 'number',
        title: 'Age',
        minimum: 18,
        maximum: 100
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Registration</h1>
      <FormThinker 
        schema={schema} 
        data={formData} 
        setData={setFormData} 
      />
    </div>
  );
}

export default App;
```

## Components

### Main Components

- **FormThinker**: The main form component that renders forms based on schema
- **FormWidget**: Internal widget component for form rendering
- **FormHeader**: Header component for forms
- **FormHeaderPill**: Pill-style header component
- **FormPlayGround**: Interactive playground for form development

### Field Components

- **Input**: Text input field
- **Checkbox**: Single checkbox field
- **MultipleCheckbox**: Multiple checkbox selection
- **Range**: Range slider input
- **Options**: Radio button options
- **SelectBox**: Dropdown selection
- **ColorPalette**: Color picker component
- **ArrayInput**: Array input field
- **RichTextEditor**: Rich text editing component
- **ArrayOfObject**: Array of object input

## Schema Format

FormThinkerJS uses a JSON schema format to define forms:

```javascript
const schema = {
  type: 'object',
  properties: {
    fieldName: {
      type: 'string', // 'string', 'number', 'boolean', 'array', 'object'
      title: 'Field Label',
      description: 'Field description',
      required: true,
      // Additional field-specific properties
    }
  }
};
```

## Styling

FormThinkerJS uses Tailwind CSS for styling. The components are designed to work seamlessly with Tailwind's utility classes. You can customize the appearance by:

1. Using Tailwind classes in your parent components
2. Overriding the default styles with custom CSS
3. Modifying the Tailwind configuration

## JavaScript Support

FormThinkerJS is built with pure JavaScript and works seamlessly with any React project:

```javascript
import { FormThinker } from 'formthinkerjs';

const MyForm = () => {
  const [data, setData] = useState({});
  
  return (
    <FormThinker
      schema={schema}
      data={data}
      setData={setData}
    />
  );
};
```

## Development

To contribute to FormThinkerJS:

```bash
# Clone the repository
git clone https://github.com/yourusername/formthinkerjs.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build the package
npm run build
```

## License

ISC License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on [GitHub](https://github.com/yourusername/formthinkerjs/issues).