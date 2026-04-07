import Link from "next/link";

export default function Home() {
	const items = [
		{ href: "/new-workout", label: "New Workout" },
		{ href: "/statistics", label: "Statistics" },
		{ href: "/recovery", label: "Recovery" },
		{ href: "/coach", label: "Coach" },
	];

	return (
		<div style={{ display: "grid", gap: 12 }}>
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className="nav-link"
					style={{
						display: "block",
						width: "100%",
						textAlign: "center",
						padding: "15% 16px",
						border: "1px solid rgba(255,255,255,0.08)",
						borderRadius: 10,
						background: "rgba(255,255,255,0.02)",
					}}
				>
					{item.label}
				</Link>
			))}
		</div>
	);
}
