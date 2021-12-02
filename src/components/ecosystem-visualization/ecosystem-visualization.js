// https://observablehq.com/@heaversm/mozilla-ecosystem@196
import MicroModal from "micromodal"; // es6 module

import notebook from "./ecosystem-visualization";

export default function define(runtime, observer) {
  MicroModal.init();
  const main = runtime.module();
  const fileAttachments = new Map([
    ["ecosystem-visualization.json", "/files/ecosystem-data.json"],
  ]);
  main.builtin(
    "FileAttachment",
    runtime.fileAttachments((name) => fileAttachments.get(name))
  );
  main.variable(observer()).define(["md"], function (md) {
    return md`
# Mozilla Ecosystem

Click to zoom in or out.`;
  });
  main.variable(observer()).define(["htl"], function (htl) {
    return htl.html`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;800&display=swap" rel="stylesheet">
<style>body { border: 0; } footer { display: none }</style>`;
  });
  main
    .variable(observer("chart"))
    .define(
      "chart",
      ["pack", "data", "d3", "width", "height", "color"],
      function (pack, data, d3, width, height, color) {
        const root = pack(data);
        let focus = root;
        let view;

        const svg = d3
          .create("svg")
          .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
          .style("display", "block")
          .style("margin", "0 -14px")
          .style("background", color(0))
          .style("cursor", "pointer")
          .on("click", (event) => zoom(event, root));

        const node = svg
          .append("g")
          .selectAll("circle")
          .data(root.descendants().slice(1))
          .join("circle")
          .attr("fill", (d) => (d.children ? color(d.depth) : "#ffa266"))
          .attr("pointer-events", (d) => (!d.children ? "none" : null))
          .on("mouseover", function () {
            d3.select(this).attr("stroke", "#000");
          })
          .on("mouseout", function () {
            d3.select(this).attr("stroke", null);
          })
          .on(
            "click",
            (event, d) =>
              focus !== d && (zoom(event, d), event.stopPropagation())
          );

        const label = svg
          .append("g")
          .style("font", "16px sans-serif")
          .style("font-family", "Inter")
          .style("font-weight", "600")
          //.attr("pointer-events", "none")
          .attr("text-anchor", "middle")
          .selectAll("text")
          .data(root.descendants())
          .join("text")
          .style("fill", "#fff")
          .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
          .style("display", (d) => (d.parent === root ? "inline" : "none"))
          .text((d) => {
            if (d.data.value) {
              const repoSize =
                d.data.value > 1000
                  ? Math.round(d.data.value / 1000) + "mb"
                  : d.data.value + "kb";
              return `${d.data.name} ${repoSize}`;
            } else {
              return d.data.name;
            }
          })
          .on("click", (event, d) => {
            if (!d.data.value) {
              if (focus !== d) {
                return zoom(event, d), event.stopPropagation();
              }
            } else {
              event.stopPropagation();
              event.preventDefault();
              const { repoImg, name } = d.data;
              console.log("click", event.currentTarget, d.data.value);
              const $modal = document.getElementById("modal");
              const $modalTitle = $modal.querySelector(".modal__title");
              const $modalImg = $modal.querySelector(".modal__img");
              $modalTitle.innerText = name;
              $modalImg.setAttribute("src", `files/${repoImg}`);
              MicroModal.show("modal");
            }
          });

        zoomTo([root.x, root.y, root.r * 2]);

        function zoomTo(v) {
          const k = width / v[2];

          view = v;

          label.attr(
            "transform",
            (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
          );
          node.attr(
            "transform",
            (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
          );
          node.attr("r", (d) => d.r * k);
        }

        function zoom(event, d) {
          const focus0 = focus;

          focus = d;

          const transition = svg
            .transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", (d) => {
              const i = d3.interpolateZoom(view, [
                focus.x,
                focus.y,
                focus.r * 2,
              ]);
              return (t) => zoomTo(i(t));
            });

          label
            .filter(function (d) {
              return d.parent === focus || this.style.display === "inline";
            })
            .transition(transition)
            .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
            .on("start", function (d) {
              if (d.parent === focus) this.style.display = "inline";
            })
            .on("end", function (d) {
              if (d.parent !== focus) this.style.display = "none";
            });
        }

        return svg.node();
      }
    );
  main
    .variable(observer("data"))
    .define("data", ["FileAttachment"], function (FileAttachment) {
      return FileAttachment("ecosystem-visualization.json").json();
    });
  main
    .variable(observer("pack"))
    .define("pack", ["d3", "width", "height"], function (d3, width, height) {
      return (data) =>
        d3.pack().size([width, height]).padding(3)(
          d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value)
        );
    });
  main.variable(observer("width")).define("width", function () {
    return 932;
  });
  main
    .variable(observer("height"))
    .define("height", ["width"], function (width) {
      return width;
    });
  main.variable(observer("format")).define("format", ["d3"], function (d3) {
    return d3.format(",d");
  });
  main.variable(observer("color")).define("color", ["d3"], function (d3) {
    return (
      d3
        .scaleLinear()
        .domain([0, 5])
        //.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .range(["#393473", "#ffa266"])
        .interpolate(d3.interpolateHcl)
    );
  });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return require("d3@6");
  });
  return main;
}
