"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { COUNTRIES } from "@/lib/countries";

type CountryComboboxProps = {
  value: string | null;
  onChange: (code: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
};

export function CountryCombobox({
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyLabel,
}: CountryComboboxProps) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const isEn = locale === "en";

  const selected = COUNTRIES.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-auto justify-between gap-3 px-3.5 py-3 rounded-2xl text-[14px]",
            "bg-foreground/5 border-foreground/10 hover:bg-foreground/8",
            !selected && "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-3 truncate">
            <span
              className={cn(
                "flex items-center justify-center size-8 rounded-full shrink-0",
                !selected && "bg-foreground/10"
              )}
              style={selected ? { background: "#F56E0F", color: "#fff" } : undefined}
            >
              <Globe className={cn("size-4", !selected && "text-muted-foreground")} />
            </span>
            <span className="font-semibold text-foreground/90 truncate">
              {selected ? (isEn ? selected.en : selected.fr) : placeholder}
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[110] w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((country) => {
                const label = isEn ? country.en : country.fr;
                return (
                  <CommandItem
                    key={country.code}
                    value={`${label} ${country.code}`}
                    onSelect={() => {
                      onChange(country.code);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "size-4",
                        value === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}