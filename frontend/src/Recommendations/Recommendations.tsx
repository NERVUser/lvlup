import React, { useState } from 'react';
import './Recommendations.css';
import {
  Button,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
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
      // Make an API request to fetch workout recommendations
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ muscleGroups: selectedGroups }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      } else {
        console.error('Error fetching recommendations');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container className="recommendations-container">
      <Typography variant="h4" className="title" gutterBottom>
        Recommendations
      </Typography>
      <Grid container spacing={3}>
        {muscleGroups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group}>
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
          </Grid>
        ))}
      </Grid>
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
