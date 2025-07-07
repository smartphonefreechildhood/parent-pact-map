import "./App.css";
import Map from "./components/Map";
import usePacts from "./hooks/usePacts";

function App() {
  const { pacts } = usePacts();

  return (
    <div className="react-pact-map">
      <div className="w-full h-full  max-h-screen bg-surface text-on-surface overflow-hidden">
        <Map pacts={pacts} />
      </div>
    </div>
  );
}

export default App;
