import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
	// eslint-disable-next-line no-unused-vars
	onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
	const [query, setQuery] = useState('');

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newQuery = e.target.value;
		setQuery(newQuery);
		onSearch(newQuery);
	};

	return (
		<div className="relative w-full">
			<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search workouts or exercises..."
				value={query}
				onChange={handleSearch}
				className="px-8 w-full"
			/>
		</div>
	);
}
