import Button from "./Button";
import Pill from "./Pill";

interface ListItemProps {
  title: string;
  description: string | React.ReactNode;
  pills?: string[];
  link: string;
  callToAction?: string;
}

function ListItem({
  title,
  description,
  pills,
  link,
  callToAction,
}: ListItemProps) {
  return (
    <li className="flex flex-col justify-between p-4 bg-inherit border-b border-gray-200 transition-shadow duration-200">
      <div className="flex-1">
        <h3 className="font-medium flex gap-1 text-lg">{title}</h3>
        <p className="flex gap-1 text-sm">{description}</p>
        <p className="flex flex-wrap gap-2 pt-2">
          {pills?.map((pill) => {
            return (
              <Pill key={pill} variant="secondary">
                {pill}
              </Pill>
            );
          })}
        </p>
      </div>
      <div className="flex self-start pt-2">
        <Button
          as="a"
          href={link}
          variant="primary"
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
        >
          {callToAction}
        </Button>
      </div>
    </li>
  );
}

export default ListItem;
