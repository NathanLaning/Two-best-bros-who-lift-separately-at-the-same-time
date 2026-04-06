"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountMenu from "./AccountMenu";

const items = [
  { href: "/new-workout", label: "New Workout" },
  { href: "/statistics", label: "Statistics" },
  { href: "/recovery", label: "Recovery" },
  { href: "/coach", label: "Coach" },
];

export default function NavBar() {
  const path = usePathname() || "/";

  return (
    <>
      <div className="nav-items" role="navigation" aria-label="Main">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={"nav-link" + (path === it.href ? " active" : "")}
          >
            {it.label}
          </Link>
        ))}
      </div>

      <div className="account">
        <AccountMenu />
      </div>

      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={"nav-link" + (path === it.href ? " active" : "")}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </>
  );
}
