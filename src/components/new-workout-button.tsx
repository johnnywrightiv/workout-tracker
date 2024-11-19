'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PlusCircle, Dumbbell, File, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Template {
	_id: string;
	name: string;
}

export default function WorkoutButton() {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const router = useRouter();

	// Fetch templates when dropdown is opened
	const handleDropdownOpen = async () => {
		try {
			const response = await axios.get('/api/templates', {
				withCredentials: true,
			});
			setTemplates(response.data);
		} catch (error) {
			console.error('Failed to fetch templates:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleTemplateSelect = async (templateId: string) => {
		try {
			// Navigate to new workout form with template data
			router.push(`/workout/new?template=${templateId}`);
		} catch (error) {
			console.error('Failed to load template:', error);
		}
		setOpen(false);
	};

	return (
		<DropdownMenu
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (isOpen) handleDropdownOpen();
			}}
		>
			<DropdownMenuTrigger asChild>
				<Button>
					<Dumbbell className="mr-2 h-4 w-4" />
					New Workout
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuItem
					onClick={() => {
						router.push('/workout/new');
						setOpen(false);
					}}
				>
					<PlusCircle className="mr-2 h-4 w-4" />
					Create New Workout
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<div className="px-2 py-1.5 text-sm font-semibold">Templates</div>
				{loading ? (
					<div className="flex items-center justify-center py-2">
						<div className="flex items-center justify-center h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-solid border-primary border-t-accent" />
					</div>
				) : templates.length > 0 ? (
					templates.map((template) => (
						<DropdownMenuItem
							key={template._id}
							onClick={() => handleTemplateSelect(template._id)}
						>
							<File className="mr-2 h-4 w-4" />
							{template.name}
						</DropdownMenuItem>
					))
				) : (
					<div className="px-2 py-1.5 text-sm text-muted-foreground">
						No templates available
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
