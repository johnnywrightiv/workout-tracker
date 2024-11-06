import { ThemeSelect } from "@/components/theme-selector";

export default function Home() {
	return (
		<div className="flex h-full items-center justify-center">
			<h1 className="text-3xl">Home Page</h1>
			<ThemeSelect />
		</div>
	);
}
