import "./App.css";
import Map from "./components/Map";
import usePacts from "./hooks/usePacts";
import classNames from "classnames";
import { logInfo } from "./util/log";

function App() {
  const { pacts } = usePacts();
  const isUrlGithub = window.location.hostname.includes("github.io");
  const isUrlLocalhost = window.location.hostname.includes("localhost");

  logInfo("hostname", window.location.hostname);

  const containerClass = classNames(
    "react-pact-map w-full max-h-screen bg-background text-on-background overflow-scroll",
    {
      "h-screen": isUrlGithub || isUrlLocalhost,
      "h-full": !isUrlGithub && !isUrlLocalhost,
    }
  );

  return (
    <div className={containerClass}>
      <Map pacts={pacts} />
    </div>
  );
}

export default App;
