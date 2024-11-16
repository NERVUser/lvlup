import React, { useState } from 'react';
import './FoodJournal.css';
import { Button, IconButton, CircularProgress, LinearProgress } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

function FoodJournal() {
    const calorieGoal = 2000;
    const [calorieIntake, setCalorieIntake] = useState(1500);
    const [carbs, setCarbs] = useState(120);    // Sample dynamic value
    const [protein, setProtein] = useState(80); // Sample dynamic value
    const [fat, setFat] = useState(40);         // Sample dynamic value

    const caloriePercentage = (calorieIntake / calorieGoal) * 100;

    return (
        <div className="food-journal-container">
            <h1 className="header">Food Journal</h1>

            {/* Calorie Summary Section */}
            <div className="calories-summary">
                <div className="calories-circle">
                    <CircularProgress
                        variant="determinate"
                        value={caloriePercentage}
                        size={100}
                        thickness={5}
                        color="success"
                    />
                    <div className="calorie-count">
                        <span>{calorieIntake}</span>
                        <small>Calories</small>
                    </div>
                </div>

                <div className="macros">
                    <p>Carbs</p>
                    <LinearProgress variant="determinate" value={(carbs / 300) * 100} />
                    <p>{carbs}g</p>

                    <p>Protein</p>
                    <LinearProgress variant="determinate" value={(protein / 150) * 100} />
                    <p>{protein}g</p>

                    <p>Fat</p>
                    <LinearProgress variant="determinate" value={(fat / 70) * 100} />
                    <p>{fat}g</p>
                </div>

                {/* Temporary Buttons for Testing */}
                <div className="test-buttons">
                    <Button onClick={() => setCarbs(carbs + 10)} variant="outlined" size="small">Add Carbs</Button>
                    <Button onClick={() => setProtein(protein + 10)} variant="outlined" size="small">Add Protein</Button>
                    <Button onClick={() => setFat(fat + 5)} variant="outlined" size="small">Add Fat</Button>
                    <Button onClick={() => setCalorieIntake(calorieIntake + 100)} variant="outlined" size="small">Add Calories</Button>
                </div>
            </div>

            {/* Meal Sections */}
            <div className="meal-section">
                <h2>Breakfast</h2>
                <Button startIcon={<AddCircleOutlineIcon />} variant="contained" className="add-food-button">Add Food</Button>
                <IconButton aria-label="edit" className="edit-button"><EditIcon /></IconButton>
            </div>

            <div className="meal-section">
                <h2>Lunch</h2>
                <Button startIcon={<AddCircleOutlineIcon />} variant="contained" className="add-food-button">Add Food</Button>
                <IconButton aria-label="edit" className="edit-button"><EditIcon /></IconButton>
            </div>

            <div className="meal-section">
                <h2>Dinner</h2>
                <Button startIcon={<AddCircleOutlineIcon />} variant="contained" className="add-food-button">Add Food</Button>
                <IconButton aria-label="edit" className="edit-button"><EditIcon /></IconButton>
            </div>
        </div>
    );
}

export default FoodJournal;