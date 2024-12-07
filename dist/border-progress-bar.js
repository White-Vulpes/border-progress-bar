import React, { useEffect, useRef, useState } from "react";
const BorderProgressBar = (props) => {
    const { strokeWidth, strokeColor, progress, loading = false } = props;
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
        borderRadius: 0,
    });
    const [currentProgress, setCurrentProgress] = useState(progress);
    const [loadingProgress, setLoadingProgress] = useState(0);
    useEffect(() => {
        const updateDimensions = () => {
            if (svgRef.current && svgRef.current.parentElement) {
                const parentElement = svgRef.current.parentElement;
                const { width, height } = parentElement.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(parentElement);
                const borderRadius = parseInt(computedStyle.borderRadius.replace("px", ""), 10);
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
        if (!loading) {
            const timeoutId = setTimeout(() => setCurrentProgress(progress), 0);
            return () => clearTimeout(timeoutId);
        }
    }, [progress, loading]);
    useEffect(() => {
        let animationFrameId;
        if (loading) {
            const startTime = performance.now();
            const animate = (timestamp) => {
                const elapsed = timestamp - startTime;
                const speed = 0.002; // Base speed
                const oscillation = Math.sin(elapsed * speed) * 0.5 + 0.5; // Oscillate between 0 and 1
                const easeInOut = oscillation < 0.5
                    ? 4 * Math.pow(oscillation, 3)
                    : 1 - Math.pow(-2 * oscillation + 2, 3) / 2; // Ease-in-out effect
                setLoadingProgress(easeInOut);
                animationFrameId = requestAnimationFrame(animate);
            };
            animationFrameId = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(animationFrameId);
    }, [loading]);
    function createSvgStrokeForBox(width, height, borderRadius) {
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
    function calculateStrokeLength(width, height, borderRadius) {
        const r = Math.min(borderRadius, width / 2, height / 2);
        const straightLength = (width - 2 * r) * 2 + (height - 2 * r) * 2;
        const cornerLength = ((2 * Math.PI * r) / 4) * 4;
        return straightLength + cornerLength;
    }
    const strokeLength = calculateStrokeLength(dimensions.width, dimensions.height, dimensions.borderRadius);
    const currentStrokeOffset = strokeLength * (1 - (loading ? loadingProgress : currentProgress));
    return (React.createElement("svg", { ref: svgRef, width: dimensions.width + strokeWidth, height: dimensions.height + strokeWidth, viewBox: `-${strokeWidth / 2} -${strokeWidth / 2} ${dimensions.width + strokeWidth} ${dimensions.height + strokeWidth}`, style: {
            position: "absolute",
            zIndex: 1,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
        } },
        React.createElement("path", { strokeWidth: strokeWidth, stroke: strokeColor, fill: "none", strokeDasharray: strokeLength, strokeDashoffset: currentStrokeOffset, style: {
                transition: loading ? undefined : "stroke-dashoffset 0.5s ease",
            }, d: createSvgStrokeForBox(dimensions.width, dimensions.height, dimensions.borderRadius) })));
};
export default BorderProgressBar;
