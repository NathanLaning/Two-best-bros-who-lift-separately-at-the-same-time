"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/new-workout", label: "New Workout" },
  { href: "/statistics", label: "Statistics" },
  { href: "/recovery", label: "Recovery" },
  { href: "/coach", label: "Coach" },
];

export default function NavBar() {
  const path = usePathname() || "/";

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={"bottom-nav-item" + (path === it.href ? " active" : "")}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
