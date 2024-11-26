import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

const WorkoutJournal = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [openDialog, setOpenDialog] = useState(false);
    const [calories, setCalories] = useState<number | null>(null);
    const [time, setTime] = useState<number | null>(null);
    const [exercises, setExercises] = useState<{ name: string; sets: string }[]>([]);
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseSets, setExerciseSets] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editWorkoutDialogOpen, setEditWorkoutDialogOpen] = useState(false);

    // const { data: }

    useEffect(() => {
        const fetchWorkoutData = async () => {
            if (selectedDate) {
                const dateKey = selectedDate.toISOString().split('T')[0];
                try {
                    const response = await axios.get(`/api/workouts/${dateKey}`);
                    if (response.data) {
                        setCalories(response.data.calories);
                        setTime(response.data.time);
                        setExercises(response.data.exercises);
                    } else {
                        setCalories(null);
                        setTime(null);
                        setExercises([]);
                    }
                } catch (error) {
                    console.error("Error fetching workout data:", error);
                }
            }
        };
        fetchWorkoutData();
    }, [selectedDate]);

    const calorieGoal = 1000; // Set the new calorie goal for 1 loop
    const caloriePercentage = calories ? (calories >= calorieGoal ? 100 : (calories / calorieGoal) * 100) : 0;
    const progressColor = calories && calories >= calorieGoal ? 'success' : 'primary';

    const handleAddWorkout = () => setOpenDialog(true);
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAddExercise = () => {
        if (exerciseName.trim() !== '' && exerciseSets.trim() !== '') {
            setExercises([...exercises, { name: exerciseName, sets: exerciseSets }]);
            setExerciseName('');
            setExerciseSets('');
        }
    };

    const handleSaveWorkout = async () => {
        if (calories !== null && time !== null) {
            handleAddExercise();
            const dateKey = selectedDate?.toISOString().split('T')[0];
            if (dateKey) {
                try {
                    await axios.post(`/api/workouts/${dateKey}`, {
                        date: dateKey,
                        calories,
                        time,
                        exercises,
                    });
                    // Optionally, update the local state after saving to reflect new data
                } catch (error) {
                    console.error("Error saving workout data:", error);
                }
            }
        }
        setOpenDialog(false);
    };

    const handleEditExercise = (index: number) => {
        setEditIndex(index);
        setExerciseName(exercises[index].name);
        setExerciseSets(exercises[index].sets);
        setEditDialogOpen(true);
    };

    const handleSaveEditExercise = () => {
        if (editIndex !== null) {
            const updatedExercises = [...exercises];
            updatedExercises[editIndex] = { name: exerciseName, sets: exerciseSets };
            setExercises(updatedExercises);
            setEditIndex(null);
            setExerciseName('');
            setExerciseSets('');
            setEditDialogOpen(false);
        }
    };

    const handleDeleteExercise = (index: number) => {
        const updatedExercises = exercises.filter((_, i) => i !== index);
        setExercises(updatedExercises);
        if (updatedExercises.length === 0) {
            setCalories(null);
            setTime(null);
        }
    };

    const handleEditWorkout = () => {
        setEditWorkoutDialogOpen(true);
    };

    const handleSaveEditWorkout = async () => {
        if (selectedDate) {
            const dateKey = selectedDate.toISOString().split('T')[0];
            if (dateKey) {
                try {
                    await axios.post(`/api/workouts/${dateKey}`, {
                        date: dateKey,
                        calories: calories || 0,
                        time: time || 0,
                        exercises,
                    });
                } catch (error) {
                    console.error("Error saving workout data:", error);
                }
            }
        }
        setEditWorkoutDialogOpen(false);
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
                <List className="exercise-list">
                {exercises.map((exercise, index) => (
                    <ListItem key={index}>
                    <ListItemText 
                        primary={exercise.name} 
                        secondary={exercise.sets} 
                        primaryTypographyProps={{ style: { color: '#000000' } }} 
                        secondaryTypographyProps={{ style: { color: '#000000' } }} 
                    />
                    <IconButton aria-label="edit" onClick={() => handleEditExercise(index)}>
                    <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteExercise(index)}>
                        <DeleteIcon />
                    </IconButton>
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
                            color={progressColor}
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
                            <Typography variant="h5">{calories !== null ? calories : 0}</Typography>
                            <Typography variant="caption">Calories</Typography>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <Typography variant="h5">{time !== null ? time : 0} Minutes</Typography>
                    </div>
                    {calories !== null && time !== null && (
                        <IconButton aria-label="edit" onClick={handleEditWorkout} style={{ marginTop: '10px' }}>
                            <EditIcon />
                        </IconButton>
                    )}
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
                        value={calories !== null ? calories : ''}
                        onChange={(e) => setCalories(Number(e.target.value))}
                    />
                    <TextField
                        label="Time Spent (minutes)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={time !== null ? time : ''}
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

            {/* Edit Exercise Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Exercise</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEditExercise} color="primary" variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Workout Dialog */}
            <Dialog open={editWorkoutDialogOpen} onClose={() => setEditWorkoutDialogOpen(false)}>
                <DialogTitle>Edit Today's Workout</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Calories Burned"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={calories !== null ? calories : ''}
                        onChange={(e) => setCalories(Number(e.target.value))}
                    />
                    <TextField
                        label="Time Spent (minutes)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={time !== null ? time : ''}
                        onChange={(e) => setTime(Number(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditWorkoutDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEditWorkout} color="primary" variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default WorkoutJournal;
