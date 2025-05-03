import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { CircleHelp, Info } from "lucide-react";

const InfoTooltip = ({
  children,
  icon = "info",
}: React.ComponentProps<any>) => {
  const getIcon = () => {
    switch (icon) {
      case "info":
        return <Info className="h-4 w-4 opacity-50"></Info>;

      case "circle-help":
        return <CircleHelp className="h-4 w-4 opacity-50"></CircleHelp>;
      default:
        return <div></div>;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{getIcon()}</TooltipTrigger>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
