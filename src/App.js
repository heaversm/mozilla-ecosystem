import "./styles/app.scss";
import Ecosystem from "./components/d3-ecosystem";
import Modal from "./components/modal";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Mozilla Ecosystem</h1>
      </header>
      <main>
        <Ecosystem />
        <Modal />
      </main>
    </div>
  );
}

export default App;
