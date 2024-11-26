import React, { useState } from 'react';
import './Recommendations.css';
import {
  Button,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from '@mui/material';

const RecommendationsPage = () => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const muscleGroups = [
    'Arms/Triceps',
    'Chest',
    'Legs',
    'Abs',
    'Back',
    'Shoulders',
  ];

  const toggleGroupSelection = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleGetRecommendations = async () => {
    try {
      // Uncomment this section to use the actual API
      // const response = await fetch('https://api.api-ninjas.com/v1/exercises', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Api-Key': 'YOUR_API_KEY_HERE',  // SETUP THE API KEY FROM https://www.api-ninjas.com/api/exercises
      //   },
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   // Filter recommendations based on selected muscle groups
      //   const filteredRecommendations = data
      //     .filter((exercise: any) => selectedGroups.includes(exercise.muscle))
      //     .map((exercise: any) => exercise.name);
      //   setRecommendations(filteredRecommendations);
      // } else {
      //   console.error('Error fetching recommendations');
      // }

      // Dummy data for testing purposes
      const dummyData = [
        { muscle: 'Arms/Triceps', name: 'Tricep Dips' },
        { muscle: 'Chest', name: 'Bench Press' },
        { muscle: 'Legs', name: 'Squats' },
        { muscle: 'Abs', name: 'Crunches' },
        { muscle: 'Back', name: 'Pull-Ups' },
        { muscle: 'Shoulders', name: 'Shoulder Press' },
      ];

      // Filter recommendations based on selected muscle groups
      const filteredRecommendations = dummyData
        .filter((exercise: any) => selectedGroups.includes(exercise.muscle))
        .map((exercise: any) => exercise.name);
      setRecommendations(filteredRecommendations);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container className="recommendations-container">
      <Typography variant="h4" className="title" gutterBottom>
        Recommendations
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3} marginBottom={3}>
        {muscleGroups.map((group) => (
          <Box key={group} width={{ xs: '100%', sm: '45%', md: '30%' }}>
            <Card
              className={
                selectedGroups.includes(group) ? 'card selected' : 'card'
              }
            >
              <CardActionArea onClick={() => toggleGroupSelection(group)}>
                <CardContent>
                  <Typography variant="h5" align="center">
                    {group}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGetRecommendations}
        className="get-recommendations-button"
      >
        Get Recommendations
      </Button>

      {recommendations.length > 0 && (
        <div className="recommendations-list">
          <Typography variant="h5" className="subtitle" gutterBottom>
            Recommended Workouts:
          </Typography>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default RecommendationsPage;
