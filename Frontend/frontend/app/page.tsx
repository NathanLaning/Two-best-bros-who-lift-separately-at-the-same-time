import Link from "next/link";

export default function Home() {
	return (
		<div>
			<h1>Welcome</h1>
			<p style={{ color: "var(--muted)", marginTop: 6 }}>
				Quick links
			</p>
			<div style={{ marginTop: 12 }}>
				<Link href="/new-workout" className="nav-link">
					Go to New Workout
				</Link>
			</div>
		</div>
	);
}
