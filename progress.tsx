import React from "react";
import { useEffect, useRef, useState } from "react";

export function Progress({
  strokeWidth,
  strokeColor,
  progress,
}: {
  strokeWidth: number;
  strokeColor: string;
  progress: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    borderRadius: 0,
  });
  const [currentProgress, setCurrentProgress] = useState(progress);

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

  useEffect(() => {
    const timeoutId = setTimeout(() => setCurrentProgress(progress), 0);
    return () => clearTimeout(timeoutId);
  }, [progress]);

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
  const strokeDashoffset = strokeLength * (1 - currentProgress);

  return (
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
        strokeDasharray={strokeLength}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: "stroke-dashoffset 0.5s ease",
        }}
        d={createSvgStrokeForBox(
          dimensions.width,
          dimensions.height,
          dimensions.borderRadius
        )}
      />
    </svg>
  );
}
