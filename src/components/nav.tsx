"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const examples = [
  {
    name: "Expressway",
    href: "/expressway",
  },
  {
    name: "Train",
    href: "/train",
  },
  {
    name: "Taxi",
    href: "/taxi",
  },
];

interface Nav extends React.HTMLAttributes<HTMLDivElement> {}

export function Nav({ className, ...props }: Nav) {
  const pathname = usePathname();

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("mb-4 flex items-center", className)} {...props}>
          {examples.map((example, index) => (
            <Link
              href={example.href}
              key={example.href}
              className={cn(
                "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
                pathname?.startsWith(example.href) ||
                  (index === 0 && pathname === "/")
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              {example.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
