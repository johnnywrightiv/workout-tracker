'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface Template {
	_id: string;
	name: string;
	duration: number;
	exercises: Array<{
		name: string;
		muscleGroup: string;
	}>;
}

export default function TemplatesPage() {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
		null
	); // Store selected template ID for confirmation
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		fetchTemplates();
	}, []);

	async function fetchTemplates() {
		try {
			const response = await axios.get('/api/templates', {
				withCredentials: true,
			});
			setTemplates(response.data);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to fetch templates',
				variant: 'destructive',
			});
		}
	}

	async function handleDelete(id: string) {
		try {
			setDeletingId(id);
			await axios.delete(`/api/templates/${id}`, {
				withCredentials: true,
			});
			toast({
				title: 'Success',
				description: 'Template deleted successfully',
			});
			fetchTemplates(); // Refresh the list
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete template',
				variant: 'destructive',
			});
		} finally {
			setDeletingId(null);
			setSelectedTemplateId(null); // Reset the selected template ID
		}
	}

	return (
		<div className="container max-w-4xl mx-auto px-4 py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Workout Templates</h1>
				<Button onClick={() => router.push('/templates/new')}>
					Create Template
				</Button>
			</div>

			<div className="grid gap-4">
				{templates.map((template) => (
					<Card key={template._id}>
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle className="text-xl">{template.name}</CardTitle>
								<div className="flex gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => router.push(`/templates/${template._id}`)}
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												disabled={deletingId === template._id}
												onClick={() => setSelectedTemplateId(template._id)} // Set the template ID for confirmation
											>
												{deletingId === template._id ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<Trash2 className="h-4 w-4" />
												)}
											</Button>
										</AlertDialogTrigger>

										{/* Confirmation Dialog */}
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Are you sure?</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be undone. This will permanently
													delete your template.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel
													onClick={() => setSelectedTemplateId(null)} // Reset the selected template ID if canceled
												>
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDelete(selectedTemplateId!)} // Proceed with delete
													className="bg-destructive hover:bg-destructive/80"
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Duration: {template.duration} minutes
							</p>
							<p className="text-sm text-muted-foreground">
								Exercises: {template.exercises.length}
							</p>
						</CardContent>
					</Card>
				))}

				{templates.length === 0 && (
					<div className="text-center py-8 text-muted-foreground">
						No templates found. Create one to get started!
					</div>
				)}
			</div>
		</div>
	);
}
