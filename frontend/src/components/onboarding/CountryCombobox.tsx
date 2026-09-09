"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Check, ChevronDown, Globe } from "lucide-react";
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
import { GlassCard } from "./GlassCard";
import { COUNTRIES } from "@/lib/countries";

const ACCENT = "#F56E0F";

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
            "transition-colors active:scale-[0.98]",
            !selected && "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-3 truncate">
            <span
              className={cn(
                "flex items-center justify-center size-8 rounded-full shrink-0",
                !selected && "bg-foreground/10"
              )}
              style={selected ? { background: ACCENT, color: "#fff" } : undefined}
            >
              <Globe className={cn("size-4", !selected && "text-muted-foreground")} />
            </span>
            <span className="font-semibold text-foreground/90 truncate">
              {selected ? (isEn ? selected.en : selected.fr) : placeholder}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 opacity-50 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[110] w-[--radix-popover-trigger-width] p-0 border-0 bg-transparent shadow-none"
        align="start"
      >
        {/* Meme recette glassmorphism que les cartes du wizard, pour rester coherent. */}
        <GlassCard innerClassName="p-0">
          <Command className="bg-transparent">
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-11 text-[14px] placeholder:text-muted-foreground"
            />
            <CommandList className="max-h-64 p-1.5">
              <CommandEmpty className="py-8 text-center text-[13px] text-muted-foreground">
                {emptyLabel}
              </CommandEmpty>
              <CommandGroup className="p-0">
                {COUNTRIES.map((country) => {
                  const label = isEn ? country.en : country.fr;
                  const isSelected = value === country.code;
                  return (
                    <CommandItem
                      key={country.code}
                      value={`${label} ${country.code}`}
                      onSelect={() => {
                        onChange(country.code);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-2.5 py-2.5 my-0.5 rounded-xl text-[14px] font-medium cursor-pointer transition-colors",
                        isSelected
                          ? "bg-[#F56E0F]/12 text-foreground"
                          : "text-foreground/80"
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center justify-center size-6 rounded-full shrink-0 border transition-colors",
                          isSelected
                            ? "border-transparent text-white"
                            : "border-foreground/15 bg-foreground/5"
                        )}
                        style={isSelected ? { background: ACCENT } : undefined}
                      >
                        {isSelected && <Check className="size-3.5" />}
                      </span>
                      <span className={cn(isSelected && "font-semibold")}>{label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </GlassCard>
      </PopoverContent>
    </Popover>
  );
}