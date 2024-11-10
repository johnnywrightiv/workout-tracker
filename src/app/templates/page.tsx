'use client';

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
	);
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		fetchTemplates();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			fetchTemplates();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete template',
				variant: 'destructive',
			});
		} finally {
			setDeletingId(null);
			setSelectedTemplateId(null);
		}
	}

	return (
		<div className="container mx-auto py-8 px-4 space-y-8">
			<div className="flex justify-between items-start gap-4 w-full">
				<h1 className="text-3xl sm:text-4xl font-bold">Templates</h1>
				<Button onClick={() => router.push('/templates/new')}>
					Create Template
				</Button>
			</div>

			<div className="space-y-6">
				{templates.map((template) => (
					<Card key={template._id} className="w-full">
						<CardHeader className="flex flex-col">
							<div className="flex justify-between items-start w-full">
								<CardTitle className="text-2xl font-bold">
									{template.name}
								</CardTitle>
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
												onClick={() => setSelectedTemplateId(template._id)}
											>
												{deletingId === template._id ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<Trash2 className="h-4 w-4" />
												)}
											</Button>
										</AlertDialogTrigger>

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
													onClick={() => setSelectedTemplateId(null)}
												>
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDelete(selectedTemplateId!)}
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
							<div className="flex flex-col space-y-1 text-muted-foreground">
								<p>Duration: {template.duration} minutes</p>
								<p>Exercises: {template.exercises.length}</p>
							</div>
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
