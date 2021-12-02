import React, { useRef, useEffect } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "./ecosystem-visualization";

function Ecosystem() {
  const chartRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, (name) => {
      if (name === "chart") return new Inspector(chartRef.current);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <div className="ecosystem-container">
      <div className="ecosystem-svg-container" ref={chartRef} />
    </div>
  );
}

export default Ecosystem;
