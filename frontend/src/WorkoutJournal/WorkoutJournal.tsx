import React, { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateCalendar } from '@mui/x-date-pickers';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './WorkoutJournal.css';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
    labels: ['1 Month Ago', '3 Weeks Ago', '2 Weeks Ago', '1 Week Ago', 'Today'],
    datasets: [{
        label: 'Weight',
        data: [180, 175, 178, 173, 170],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.4)',
    }],
};

const options = {
    responsive: true,
    plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'Weight' },
    },
};

const WorkoutJournal: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [calories, setCalories] = useState(0);
    const [time, setTime] = useState(0);
    const [exercises, setExercises] = useState<{ name: string; sets: string }[]>([]);
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseSets, setExerciseSets] = useState('');

    const calorieGoal = 500; // Example goal for dynamic circular progress
    const caloriePercentage = (calories / calorieGoal) * 100;

    const handleAddWorkout = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleAddExercise = () => {
        setExercises([...exercises, { name: exerciseName, sets: exerciseSets }]);
        setExerciseName('');
        setExerciseSets('');
    };

    const handleSaveWorkout = () => {
        handleCloseDialog();
    };

    return (
        <div className="workout-journal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Top-Left: Date Calendar */}
            <Card>
                <CardContent>
                    <Typography variant="h6">Select Date</Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateCalendar value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} />
                    </LocalizationProvider>
                </CardContent>
            </Card>

            {/* Top-Right: Weight Progress Graph */}
            <Card>
                <CardContent>
                    <Typography variant="h6">Weight Progress</Typography>
                    <Line data={data} options={options} />
                </CardContent>
            </Card>

            {/* Bottom-Left: Exercises List */}
            <Card>
                <CardContent>
                    <Typography variant="h6">Exercises</Typography>
                    <List>
                        {exercises.map((exercise, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={exercise.name} secondary={exercise.sets} />
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '20px' }}
                        onClick={handleAddWorkout}
                    >
                        Add Workout
                    </Button>
                </CardContent>
            </Card>

            {/* Bottom-Right: Calories and Time */}
            <Card>
                <CardContent style={{ textAlign: 'center' }}>
                    <Typography variant="h6">Today's Workout</Typography>
                    <div style={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                            variant="determinate"
                            value={caloriePercentage}
                            size={100}
                            thickness={5}
                            color="primary"
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h5">{calories}</Typography>
                            <Typography variant="caption">Calories</Typography>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <Typography variant="h5">{time} Minutes</Typography>
                    </div>
                </CardContent>
            </Card>

            {/* Workout Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add Workout Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Calories Burned"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={calories}
                        onChange={(e) => setCalories(Number(e.target.value))}
                    />
                    <TextField
                        label="Time Spent (minutes)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                    />
                    <TextField
                        label="Exercise Name"
                        fullWidth
                        margin="dense"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                    />
                    <TextField
                        label="Sets (e.g., 3x10)"
                        fullWidth
                        margin="dense"
                        value={exerciseSets}
                        onChange={(e) => setExerciseSets(e.target.value)}
                    />
                    <Button onClick={handleAddExercise} variant="outlined" color="primary" style={{ marginTop: '10px' }}>
                        Add Exercise
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveWorkout} color="primary" variant="contained">
                        Save Workout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default WorkoutJournal;