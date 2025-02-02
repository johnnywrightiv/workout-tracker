import { Input } from '@/components/ui/input';
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
		<Input
			type="search"
			placeholder="Search workouts or exercises..."
			value={query}
			onChange={handleSearch}
			className="w-full"
		/>
	);
}
