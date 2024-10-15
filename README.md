# Border Progress Bar Component

A customizable progress bar component for React that visually represents progress using a border style. This component dynamically adjusts based on the height, width, and border radius of its parent element, rendering an SVG that encapsulates the div to illustrate progress.

## Installation

To install the package, execute the following command:

```bash
npm install @whitevulpes/border-progress-bar
```

## Demo

You can view a live demo of the component at the following link:

- [Live Demo](https://codesandbox.io/p/sandbox/r7ctk3)

## Usage

Here’s a basic example of how to use the `BorderProgressBar` component in your application:

```tsx
import BorderProgressBar from "@whitevulpes/border-progress-bar";

export default function App() {
  return (
    <div className="App">
      <p>Edit the props to customize the progress bar.</p>
      <div className="test-div">
        <BorderProgressBar strokeWidth={4} strokeColor={"green"} progress={1} />
      </div>
    </div>
  );
}
```

## Props

The `BorderProgressBar` component accepts the following props:

- **`progress`** (required): A number between 0 and 1 representing the completion percentage of the progress bar.
- **`strokeWidth`** (required): A number defining the thickness of the border surrounding the progress bar.
- **`strokeColor`** (required): A string representing the color of the border.

## Contributing

We welcome contributions! Feel free to fork the repository, make your enhancements, and submit a pull request.
