function Ecosystem({ data }) {
  return (
    <div className="ecosystem-container">
      <iframe
        className="ecosystem-iframe"
        width="100%"
        height="1087"
        frameBorder="0"
        src="https://observablehq.com/embed/@heaversm/mozilla-ecosystem?cells=chart"
      ></iframe>
    </div>
  );
}

export default Ecosystem;
