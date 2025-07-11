import "./App.css";
import Map from "./components/Map";
import usePacts from "./hooks/usePacts";

function App() {
  const { pacts } = usePacts();

  return (
    <div className="react-pact-map">
      <div className="w-full h-screen  max-h-screen bg-background text-on-background overflow-scroll">
        <Map pacts={pacts} />
      </div>
    </div>
  );
}

export default App;
