import classNames from "classnames";

interface SearchInfoProps {
  title: string;
  description: string;
  fullHeight?: boolean;
}

export default function SearchInfo({
  title,
  description,
  fullHeight = false,
}: SearchInfoProps) {
  return (
    <div
      className={classNames(
        "flex flex-col gap-1 py-2 px-3 bg-background-secondary",
        {
          "h-full": fullHeight,
        }
      )}
    >
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs italic">{description}</p>
    </div>
  );
}
