"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X, ChevronDown } from "lucide-react";
import * as React from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface Option {
  value: string;
  label: string;
  image?: string;
  placeId?: string; // Optional for places
}

interface SingleSelectorProps {
  value?: Option | null;
  options: Option[];
  onChange?: (option: Option | null) => void;
  onSearch?: (input: string) => Promise<Option[]>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  loadingIndicator?: React.ReactNode;
  emptyIndicator?: React.ReactNode;
}

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => {
  const show = useCommandState((state) => state.filtered.count === 0);
  if (!show) return null;
  return (
    <div
      ref={ref}
      className={cn("py-6 text-center text-sm", className)}
      role="presentation"
      {...props}
    />
  );
});
CommandEmpty.displayName = "CommandEmpty";

const SingleSelector = React.forwardRef<HTMLDivElement, SingleSelectorProps>(
  (
    {
      value,
      options,
      onChange,
      onSearch,
      placeholder = "Select an option",
      disabled = false,
      className,
      inputClassName,
      loadingIndicator = <div className="p-2 text-center">Loading...</div>,
      emptyIndicator = "No results found.",
    },
    _ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [input, setInput] = React.useState(value?.label ?? "");
    const [items, setItems] = React.useState<Option[]>(options || []);
    const [isLoading, setIsLoading] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const debouncedInput = useDebounce(input, 300);

    React.useEffect(() => {
      // only run when dropdown is open and we actually have an onSearch fn
      if (!open || !onSearch) return;

      // if the user hasn't typed 3 chars yet, do nothing at all
      if (debouncedInput.trim() === "") {
        setIsLoading(false);
        setItems([]);
        return;
      }
      if (debouncedInput.trim().length < 3) {
        setIsLoading(false);
        setItems(options || []);
        return;
      }

      let cancelled = false;
      (async () => {
        setIsLoading(true);
        try {
          const result = await onSearch(debouncedInput.trim());
          if (!cancelled) {
            setItems(result);
          }
        } catch (err) {
          console.error("Error in onSearch:", err);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();

      // clean up if input/open changes before request finishes
      return () => {
        cancelled = true;
      };
    }, [debouncedInput, onSearch, open]);

    const displayItems = onSearch
      ? items
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(input.trim().toLowerCase())
        );

    React.useEffect(() => {
      if (!value) return;
      setInput(value.label);
    }, [value]);

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node) &&
          !inputRef.current?.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <Command
        ref={dropdownRef}
        className={cn(
          "relative h-auto overflow-visible bg-transparent",
          className
        )}
        shouldFilter={!onSearch}
      >
        <div
          className={cn(
            "flex min-h-10 items-center rounded-md border border-input px-3 py-2 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm"
          )}
        >
          <input
            ref={inputRef}
            value={input}
            onFocus={() => setOpen(true)}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
              inputClassName
            )}
          />
          {value && !disabled && (
            <button
              onClick={() => {
                onChange?.(null);
                setInput("");
              }}
              type="button"
              className="mr-1 text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setOpen((prev) => !prev)}
            type="button"
            className="text-muted-foreground"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {open && displayItems.length > 0 && (
          <CommandList className="absolute z-10000 top-[40px] mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
            {isLoading ? (
              <div>{loadingIndicator}</div>
            ) : (
              <>
                <CommandEmpty>{emptyIndicator}</CommandEmpty>
                {!onSearch && displayItems.length === 0 && (
                  <div className="py-6 text-center text-sm">
                    {emptyIndicator}
                  </div>
                )}
                <CommandGroup>
                  {displayItems.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onChange?.(option);
                        setInput(option.label);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {option.image && (
                        <Image
                          src={option.image}
                          alt={option.label}
                          width={24}
                          height={24}
                          className="mr-2 rounded-full"
                        />
                      )}
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        )}
      </Command>
    );
  }
);

SingleSelector.displayName = "SingleSelector";
export default SingleSelector;
