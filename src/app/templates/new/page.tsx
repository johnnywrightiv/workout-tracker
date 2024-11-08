'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import WorkoutForm from '@/components/workout-form';
import axios from 'axios';

export default function NewWorkout() {
  const router = useRouter();
  const { templateId } = router.query; // Get templateId from the URL

  const [templateData, setTemplateData] = useState(null);

  useEffect(() => {
    // If there's a templateId in the query, fetch the template data
    if (templateId) {
      async function fetchTemplate() {
        try {
          const response = await axios.get(`/api/templates/${templateId}`, {
            withCredentials: true,
          });
          setTemplateData(response.data);
        } catch (error) {
          console.error('Failed to fetch template:', error);
        }
      }
      fetchTemplate();
    }
  }, [templateId]);

  const handleSubmit = async (data) => {
    try {
      await axios.post('/api/workouts', data, { withCredentials: true });
      // Navigate to the workout list after successful submission
      router.push('/workouts');
    } catch (error) {
      console.error('Failed to create workout:', error);
    }
  };

  return (
    <WorkoutForm
      initialData={templateData} // Pass the fetched template data as initialData
      isTemplate={true} // Indicate that this is based on a template
      onSubmit={handleSubmit}
    />
  );
}
