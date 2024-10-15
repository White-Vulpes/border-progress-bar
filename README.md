Here’s a possible README for your project based on the contents of the repository:

---

# Border Progress Bar

A customizable progress bar component for React that displays progress with a border style.

## Installation

To install the package, run:

```bash
npm install @whitevulpes/border-progress-bar
```

## Usage

```tsx
import React from 'react';
import BorderProgressBar from 'border-progress-bar';

function App() {
  return (
    <div>
      <BorderProgressBar strokWidth={3} strokeColor='green' progress={70} />
    </div>
  );
}

export default App;
```

## Props

- `progress` (required): A number between 0 and 100 that represents the progress percentage.
- `strokeWidth` (required): A number that represents the width of the border.
- `strokeColor` (required): A color that represents the color of the border.
  

## Contributing

Feel free to fork the repo, make changes, and submit a pull request.
