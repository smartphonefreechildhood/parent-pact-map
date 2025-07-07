import type { Pact } from "../types/Pact";
import ListItem from "./ListItem";

interface ListProps {
  visibleMarkers: [Pact, [number, number]][];
}

function List({ visibleMarkers }: ListProps) {
  const total = visibleMarkers.reduce((acc, [info]) => acc + info.count, 0);
  return (
    <div className="w-full h-full overflow-y-scroll bg-white border-l border-gray-200">
      <div className="py-4">
        <div className="flex px-4">
          <h2 className="text-xl font-medium text-black mb-4 flex-1">
            Resultat
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Totalt: {total} {total === 1 ? "medlem" : "medlemmar"}
          </p>
        </div>
        <ul className="">
          {visibleMarkers.map(([info, [,]], i) => (
            <ListItem
              key={`${info.school}-${i}`}
              title={info.school}
              description={`${info.count} ${
                info.count === 1 ? "medlem" : "medlemmar"
              }`}
              pills={Object.entries(info.schoolYears).map(
                ([year, count]) => `${year}: ${count}`
              )}
              link={info.contact || ""}
            />
          ))}
        </ul>
        {visibleMarkers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Inga pakter hittades i denna region</p>
          </div>
        )}
        <div className="text-center py-8 text-gray-500">
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
