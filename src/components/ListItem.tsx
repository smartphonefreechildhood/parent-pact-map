import classNames from "classnames";
import Pill from "./Pill";

interface ListItemProps {
  title: string;
  description: string | React.ReactNode;
  pills?: string[];
  link: string;
}

interface ListLinkProps {
  link: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

function ListLink({ link, children, variant = "primary" }: ListLinkProps) {
  const listLinkClass = classNames(
    "px-4 py-1 font-semibold cursor-pointer transition-colors text-sm rounded-3xl",
    {
      "bg-primary text-on-primary hover:bg-primary/80 border-none":
        variant === "primary",
      "bg-inherit text-white border border-primary": variant === "secondary",
    }
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={listLinkClass}
    >
      {children}
    </a>
  );
}

function ListItem({ title, description, pills, link }: ListItemProps) {
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
      <div className="flex self-start p-1">
        <ListLink link={link} variant="secondary">
          Gå med i pakt
        </ListLink>
      </div>
    </li>
  );
}

export default ListItem;
