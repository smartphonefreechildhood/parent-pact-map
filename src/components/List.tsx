import type { Pact } from "../types/Pact";
import ListItem from "./ListItem";

interface ListProps {
  filteredPacts: Pact[];
}

function List({ filteredPacts }: ListProps) {
  return (
    <div className="w-full h-full overflow-y-scroll bg-inherit">
      <div className="py-4">
        <ul className="">
          {filteredPacts.map((pact, i) => (
            <ListItem
              key={`${pact.id}-${i}`}
              title={`Pact: ${pact.name}`}
              description={`${pact.studentCount} ${
                pact.studentCount === 1 ? "medlem" : "medlemmar"
              }`}
              // pills={pact.municipality}
              link={pact.contact || ""}
            />
          ))}
        </ul>
        {filteredPacts.length === 0 && (
          <div className="text-center py-8">
            <p>Inga pakter hittades i denna region</p>
          </div>
        )}
        <div className="text-center py-8">
          <p>
            Hittade du ingen pakt för din skola?{" "}
            <a
              href="https://forms.smartphonefreechildhood.se/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              Skapa en ny pakt
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default List;
