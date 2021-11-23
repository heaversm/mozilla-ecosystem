import "./styles/app.scss";
import Ecosystem from "./components/d3-ecosystem";
import ecosystemData from "./data/ecosystem-data.json";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Mozilla Ecosystem</h1>
      </header>
      <main>
        <Ecosystem data={ecosystemData} />
      </main>
    </div>
  );
}

export default App;
