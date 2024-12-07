import React, { useEffect, useRef, useState } from "react";

const BorderProgressBar = (props: {
  strokeWidth: number;
  strokeColor: string;
  progress: number; // Progress value (0 to 1)
  loading?: boolean; // Add loading prop
}) => {
  const { strokeWidth, strokeColor, progress, loading = false } = props;
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    borderRadius: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current && svgRef.current.parentElement) {
        const parentElement = svgRef.current.parentElement;
        const { width, height } = parentElement.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(parentElement);
        const borderRadius = parseInt(
          computedStyle.borderRadius.replace("px", ""),
          10
        );
        setDimensions({
          width: width + strokeWidth / 2,
          height: height + strokeWidth / 2,
          borderRadius: borderRadius + strokeWidth / 2,
        });
      }
    };
    updateDimensions();
  }, [strokeWidth]);

  function createSvgStrokeForBox(
    width: number,
    height: number,
    borderRadius: number
  ) {
    const r = Math.min(borderRadius, width / 2, height / 2);
    const midX = width / 2;

    return `
    M ${midX},0
    H ${width - r}
    A ${r},${r} 0 0 1 ${width},${r}
    V ${height - r}
    A ${r},${r} 0 0 1 ${width - r},${height}
    H ${r}
    A ${r},${r} 0 0 1 0,${height - r}
    V ${r}
    A ${r},${r} 0 0 1 ${r},0
    H ${midX}
  `;
  }

  function calculateStrokeLength(
    width: number,
    height: number,
    borderRadius: number
  ) {
    const r = Math.min(borderRadius, width / 2, height / 2);
    const straightLength = (width - 2 * r) * 2 + (height - 2 * r) * 2;
    const cornerLength = ((2 * Math.PI * r) / 4) * 4;
    return straightLength + cornerLength;
  }

  const strokeLength = calculateStrokeLength(
    dimensions.width,
    dimensions.height,
    dimensions.borderRadius
  );

  // CSS Keyframes for continuous motion animation
  const animationStyle = `
    @keyframes continuous-motion {
      0% {
        stroke-dasharray: ${strokeLength * 0.1} ${strokeLength * 0.9};
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: ${strokeLength * 0.5} ${strokeLength * 0.5};
        stroke-dashoffset: -${strokeLength * 0.25};
      }
      100% {
        stroke-dasharray: ${strokeLength * 0.1} ${strokeLength * 0.9};
        stroke-dashoffset: -${strokeLength};
      }
    }
  `;

  // Calculate the dash offset for the progress bar when loading is false
  const strokeDasharray = loading
    ? undefined // Animated stroke-dasharray for loading
    : `${progress * strokeLength} ${strokeLength - progress * strokeLength}`;

  const strokeDashoffset = loading
    ? undefined // Animated stroke-dashoffset for loading
    : 0; // Static stroke-dashoffset for progress

  return (
    <>
      <style>{animationStyle}</style>
      <svg
        ref={svgRef}
        width={dimensions.width + strokeWidth}
        height={dimensions.height + strokeWidth}
        viewBox={`-${strokeWidth / 2} -${strokeWidth / 2} ${
          dimensions.width + strokeWidth
        } ${dimensions.height + strokeWidth}`}
        style={{
          position: "absolute",
          zIndex: 1,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <path
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          fill="none"
          style={{
            strokeDasharray: strokeDasharray,
            strokeDashoffset: strokeDashoffset,
            animation: loading
              ? "continuous-motion 1.5s linear infinite"
              : undefined, // Animation only when loading
            transition: loading ? undefined : "stroke-dasharray 0.5s ease", // Smooth transition for progress
          }}
          d={createSvgStrokeForBox(
            dimensions.width,
            dimensions.height,
            dimensions.borderRadius
          )}
        />
      </svg>
    </>
  );
};

export default BorderProgressBar;
