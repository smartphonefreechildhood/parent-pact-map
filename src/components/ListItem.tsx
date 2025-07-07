import Button from "./Button";
import Pill from "./Pill";

interface ListItemProps {
  title: string;
  description: string | React.ReactNode;
  pills: string[];
  link: string;
}

function ListLink({
  link,
  children,
}: {
  link: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 border-none rounded-sm cursor-pointer transition-colors text-base bg-gray-200 text-primary border border-primary hover:bg-primary hover:text-white"
    >
      {children}
    </a>
  );
}

function ListItem({ title, description, pills, link }: ListItemProps) {
  return (
    <li className="flex items-center justify-between p-4 bg-white border-b border-gray-200 hover:bg-gray-100 transition-shadow duration-200">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 flex gap-1 ">{title}</h3>
        <p className="text-sm text-gray-600 flex gap-1">{description}</p>
        <p className="flex flex-wrap gap-2 pt-2">
          {pills.map((pill) => {
            return <Pill key={pill}>{pill}</Pill>;
          })}
        </p>
      </div>
      <ListLink link={link}>Gå med</ListLink>
    </li>
  );
}

export default ListItem;
