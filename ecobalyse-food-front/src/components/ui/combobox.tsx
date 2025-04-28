"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Combobox({
  options,
  placeholder = "Select one...",
  searchPlaceholder = "Search...",
  visibleOptionsLimit = 5,
  onChange,
}: {
  options: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  visibleOptionsLimit?: number;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState("");

  const displayedLabel = React.useMemo(() => {
    if (!selectedOption) return "";
    return options.find((option) => option === selectedOption);
  }, [selectedOption, options]);
  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Limit the number of visible options
  const visibleOptions = React.useMemo(() => {
    return filteredOptions.slice(0, visibleOptionsLimit);
  }, [filteredOptions, visibleOptionsLimit]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === selectedOption ? "" : currentValue;
      setSelectedOption(newValue);
      onChange?.(newValue);
      setOpen(false);
    },
    [selectedOption, onChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span
            className={
              "truncate " +
              (displayedLabel ? "text-foreground" : "text-muted-foreground")
            }
          >
            {displayedLabel ? displayedLabel : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {visibleOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(a) => handleSelect(a)}
                >
                  {option}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedOption === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
              {filteredOptions.length > visibleOptionsLimit && (
                <div className="py-2 px-2 text-xs text-muted-foreground text-center">
                  {filteredOptions.length - visibleOptionsLimit} more options
                  available. Refine your search to see more.
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
