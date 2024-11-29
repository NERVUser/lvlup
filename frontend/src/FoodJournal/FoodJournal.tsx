import React, { useState, useEffect } from 'react';
import './FoodJournal.css';
import { Button, IconButton, CircularProgress, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers';

function FoodJournal() {
    const calorieGoal = 2000;
    const carbsGoal = 300;
    const proteinGoal = 250;
    const fatGoal = 100;
    
    const [calorieIntake, setCalorieIntake] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);

    const [breakfastItems, setBreakfastItems] = useState<{ name: string; quantity: string; calories: number; carbs: number; protein: number; fat: number }[]>([]);
    const [lunchItems, setLunchItems] = useState<{ name: string; quantity: string; calories: number; carbs: number; protein: number; fat: number }[]>([]);
    const [dinnerItems, setDinnerItems] = useState<{ name: string; quantity: string; calories: number; carbs: number; protein: number; fat: number }[]>([]);
    const [currentMeal, setCurrentMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [foodName, setFoodName] = useState('');
    const [foodQuantity, setFoodQuantity] = useState('');
    const [foodCalories, setFoodCalories] = useState<number | null>(null);
    const [foodCarbs, setFoodCarbs] = useState<number | null>(null);
    const [foodProtein, setFoodProtein] = useState<number | null>(null);
    const [foodFat, setFoodFat] = useState<number | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState(false);
    const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);

    const caloriePercentage = (calorieIntake / calorieGoal) * 100;
    const carbsPercentage = (carbs / carbsGoal) * 100;
    const proteinPercentage = (protein / proteinGoal) * 100;
    const fatPercentage = (fat / fatGoal) * 100;

    useEffect(() => {
        if (selectedDate) {
            fetchFoodData(selectedDate);
        }
    }, [selectedDate]);

    const fetchFoodData = async (date: Date) => {
        setLoading(true);
        const dateKey = date.toISOString().split('T')[0];
        try {
            const response = await axios.get(`/api/foodJournal/${dateKey}`);
            if (response.data) {
                setBreakfastItems(response.data.breakfastItems);
                setLunchItems(response.data.lunchItems);
                setDinnerItems(response.data.dinnerItems);
                setCalorieIntake(response.data.calorieIntake);
                setCarbs(response.data.carbs);
                setProtein(response.data.protein);
                setFat(response.data.fat);
            } else {
                resetFoodData();
            }
        } catch (error) {
            console.error("Error fetching food data:", error);
            resetFoodData();
        } finally {
            setLoading(false);
        }
    };

    const resetFoodData = () => {
        setBreakfastItems([]);
        setLunchItems([]);
        setDinnerItems([]);
        setCalorieIntake(0);
        setCarbs(0);
        setProtein(0);
        setFat(0);
    };

    const handleAddFood = (meal: 'breakfast' | 'lunch' | 'dinner') => {
        setCurrentMeal(meal);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFoodName('');
        setFoodQuantity('');
        setFoodCalories(null);
        setFoodCarbs(null);
        setFoodProtein(null);
        setFoodFat(null);
    };

    const handleSaveFood = async () => {
        if (foodName.trim() !== '' && foodQuantity.trim() !== '') {
            const newFoodItem = {
                name: foodName,
                quantity: foodQuantity,
                calories: foodCalories || 0,
                carbs: foodCarbs || 0,
                protein: foodProtein || 0,
                fat: foodFat || 0,
            };
            let updatedItems;
            if (currentMeal === 'breakfast') {
                updatedItems = [...breakfastItems, newFoodItem];
                setBreakfastItems(updatedItems);
            } else if (currentMeal === 'lunch') {
                updatedItems = [...lunchItems, newFoodItem];
                setLunchItems(updatedItems);
            } else if (currentMeal === 'dinner') {
                updatedItems = [...dinnerItems, newFoodItem];
                setDinnerItems(updatedItems);
            }
            setCalorieIntake(calorieIntake + (foodCalories || 0));
            setCarbs(carbs + (foodCarbs || 0));
            setProtein(protein + (foodProtein || 0));
            setFat(fat + (foodFat || 0));

            const dateKey = selectedDate?.toISOString().split('T')[0];
            if (dateKey) {
                try {
                    await axios.post(`/api/foodJournal/${dateKey}`, {
                        date: dateKey,
                        breakfastItems,
                        lunchItems,
                        dinnerItems,
                        calorieIntake: calorieIntake + (foodCalories || 0),
                        carbs: carbs + (foodCarbs || 0),
                        protein: protein + (foodProtein || 0),
                        fat: fat + (foodFat || 0),
                    });
                } catch (error) {
                    console.error("Error saving food data:", error);
                }
            }
        }
        handleCloseDialog();
    };

    const handleEditFood = (meal: 'breakfast' | 'lunch' | 'dinner', index: number) => {
        setCurrentMeal(meal);
        setEditIndex(index);
        const items = meal === 'breakfast' ? breakfastItems : meal === 'lunch' ? lunchItems : dinnerItems;
        const item = items[index];
        setFoodName(item.name);
        setFoodQuantity(item.quantity);
        setFoodCalories(item.calories);
        setFoodCarbs(item.carbs);
        setFoodProtein(item.protein);
        setFoodFat(item.fat);
        setEditDialogOpen(true);
    };

    const handleSaveEditFood = async () => {
        if (editIndex !== null) {
            const updatedItems = currentMeal === 'breakfast' ? [...breakfastItems] : currentMeal === 'lunch' ? [...lunchItems] : [...dinnerItems];
            const oldItem = updatedItems[editIndex];
            updatedItems[editIndex] = {
                name: foodName,
                quantity: foodQuantity,
                calories: foodCalories || 0,
                carbs: foodCarbs || 0,
                protein: foodProtein || 0,
                fat: foodFat || 0,
            };
            if (currentMeal === 'breakfast') {
                setBreakfastItems(updatedItems);
            } else if (currentMeal === 'lunch') {
                setLunchItems(updatedItems);
            } else if (currentMeal === 'dinner') {
                setDinnerItems(updatedItems);
            }
            // Update totals
            setCalorieIntake(calorieIntake - oldItem.calories + (foodCalories || 0));
            setCarbs(carbs - oldItem.carbs + (foodCarbs || 0));
            setProtein(protein - oldItem.protein + (foodProtein || 0));
            setFat(fat - oldItem.fat + (foodFat || 0));

            const dateKey = selectedDate?.toISOString().split('T')[0];
            if (dateKey) {
                try {
                    await axios.post(`/api/foodJournal/${dateKey}`, {
                        date: dateKey,
                        breakfastItems,
                        lunchItems,
                        dinnerItems,
                        calorieIntake: calorieIntake - oldItem.calories + (foodCalories || 0),
                        carbs: carbs - oldItem.carbs + (foodCarbs || 0),
                        protein: protein - oldItem.protein + (foodProtein || 0),
                        fat: fat - oldItem.fat + (foodFat || 0),
                    });
                } catch (error) {
                    console.error("Error saving edited food data:", error);
                }
            }

            setEditIndex(null);
            setFoodName('');
            setFoodQuantity('');
            setFoodCalories(null);
            setFoodCarbs(null);
            setFoodProtein(null);
            setFoodFat(null);
            setEditDialogOpen(false);
        }
    };

    const handleDeleteFood = async (meal: 'breakfast' | 'lunch' | 'dinner', index: number) => {
        const updatedItems = meal === 'breakfast' ? breakfastItems.filter((_, i) => i !== index)
            : meal === 'lunch' ? lunchItems.filter((_, i) => i !== index)
            : dinnerItems.filter((_, i) => i !== index);

        const deletedItem = meal === 'breakfast' ? breakfastItems[index]
            : meal === 'lunch' ? lunchItems[index]
            : dinnerItems[index];

        if (meal === 'breakfast') {
            setBreakfastItems(updatedItems);
        } else if (meal === 'lunch') {
            setLunchItems(updatedItems);
        } else if (meal === 'dinner') {
            setDinnerItems(updatedItems);
        }
        // Update totals
        setCalorieIntake(calorieIntake - deletedItem.calories);
        setCarbs(carbs - deletedItem.carbs);
        setProtein(protein - deletedItem.protein);
        setFat(fat - deletedItem.fat);

        const dateKey = selectedDate?.toISOString().split('T')[0];
        if (dateKey) {
            try {
                await axios.post(`/api/foodJournal/${dateKey}`, {
                    date: dateKey,
                    breakfastItems,
                    lunchItems,
                    dinnerItems,
                    calorieIntake: calorieIntake - deletedItem.calories,
                    carbs: carbs - deletedItem.carbs,
                    protein: protein - deletedItem.protein,
                    fat: fat - deletedItem.fat,
                });
            } catch (error) {
                console.error("Error saving food data after deletion:", error);
            }
        }
    };

    const handleOpenCalendarDialog = () => {
        setCalendarDialogOpen(true);
    };

    const handleCloseCalendarDialog = () => {
        setCalendarDialogOpen(false);
    };

    return (
        <div className="food-journal-container">
            <h1 className="header" style={{ textAlign: 'center' }}>
                <Button variant="text" onClick={handleOpenCalendarDialog} style={{ fontSize: '2rem', color: '#1976d2' }}>
                    Today
                </Button>
            </h1>

            {/* Calendar Dialog */}
            <Dialog open={calendarDialogOpen} onClose={handleCloseCalendarDialog}>
                <DialogTitle>Select Date</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateCalendar value={selectedDate} onChange={(newDate) => {
                            setSelectedDate(newDate);
                            handleCloseCalendarDialog();
                        }} />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCalendarDialog} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Calorie Summary Section */}
            <div className="calories-summary">
                <div className="calories-circle">
                    <CircularProgress
                        variant="determinate"
                        value={Math.min(caloriePercentage, 100)}
                        size={100}
                        thickness={5}
                        color={calorieIntake >= calorieGoal ? "success" : "primary"}
                    />
                    <div className="calorie-count" style={{ color: calorieIntake >= calorieGoal ? '#4caf50' : '#1976d2' }}>
                        <span>{calorieIntake} Cals</span>
                    </div>
                </div>

                <div className="macros">
                    <p style={{ color: '#ccc' }}>Carbs</p>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(carbsPercentage, 100)}
                        color={carbs >= carbsGoal ? "success" : "primary"}
                    />
                    <p style={{ color: carbs >= carbsGoal ? '#4caf50' : '#1976d2' }}>{carbs}g</p>

                    <p style={{ color: '#ccc' }}>Protein</p>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(proteinPercentage, 100)}
                        color={protein >= proteinGoal ? "success" : "primary"}
                    />
                    <p style={{ color: protein >= proteinGoal ? '#4caf50' : '#1976d2' }}>{protein}g</p>

                    <p style={{ color: '#ccc' }}>Fat</p>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(fatPercentage, 100)}
                        color={fat >= fatGoal ? "success" : "primary"}
                    />
                    <p style={{ color: fat >= fatGoal ? '#4caf50' : '#1976d2' }}>{fat}g</p>
                </div>
            </div>

            {/* Meal Sections */}
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
                <div key={meal} className="meal-section">
                    <h2>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h2>
                    <List>
                        {(meal === 'breakfast' ? breakfastItems : meal === 'lunch' ? lunchItems : dinnerItems).map((item, index) => (
                            <ListItem key={index} style={{ color: '#ffffff', backgroundColor: '#424242', borderRadius: '8px', marginBottom: '10px', padding: '10px' }}>
                                <ListItemText primary={<strong>{item.name}</strong>} secondary={<span style={{ fontSize: '0.9rem' }}>{`${item.quantity}, Calories: ${item.calories}, Carbs: ${item.carbs}g, Protein: ${item.protein}g, Fat: ${item.fat}g`}</span>} />
                                <IconButton aria-label="edit" onClick={() => handleEditFood(meal as 'breakfast' | 'lunch' | 'dinner', index)} style={{ color: '#ffffff' }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => handleDeleteFood(meal as 'breakfast' | 'lunch' | 'dinner', index)} style={{ color: '#ffffff' }}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    <Button startIcon={<AddCircleOutlineIcon />} variant="contained" className="add-food-button" onClick={() => handleAddFood(meal as 'breakfast' | 'lunch' | 'dinner')}>
                        Add Food
                    </Button>
                </div>
            ))}
    
            {/* Add Food Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add Food Item</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Food Name"
                        fullWidth
                        margin="dense"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                    />
                    <TextField
                        label="Quantity (e.g., 100g, 1 cup)"
                        fullWidth
                        margin="dense"
                        value={foodQuantity}
                        placeholder="e.g., 100g, 1 cup"
                        onChange={(e) => setFoodQuantity(e.target.value)}
                    />
                    <TextField
                        label="Calories"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={foodCalories || ''}
                        onChange={(e) => setFoodCalories(Number(e.target.value))}
                    />
                    <TextField
                        label="Carbs (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={foodCarbs || ''}
                        onChange={(e) => setFoodCarbs(Number(e.target.value))}
                    />
                    <TextField
                        label="Protein (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={foodProtein || ''}
                        onChange={(e) => setFoodProtein(Number(e.target.value))}
                    />
                    <TextField
                        label="Fat (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={foodFat || ''}
                        onChange={(e) => setFoodFat(Number(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveFood} color={foodCalories && foodCalories >= 2000 ? "success" : "primary"} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
    
            {/* Edit Food Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Food Item</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Food Name"
                        fullWidth
                        margin="dense"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                    />
                    <TextField
                        label="Quantity (e.g., 100g, 1 cup)"
                        fullWidth
                        margin="dense"
                        value={foodQuantity}
                        placeholder="e.g., 100g, 1 cup"
                        onChange={(e) => setFoodQuantity(e.target.value)}
                    />
                    <TextField
                        label="Calories"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={foodCalories || ''}
                        onChange={(e) => setFoodCalories(Number(e.target.value))}
                    />
                    <TextField
                        label="Carbs (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={foodCarbs || ''}
                        onChange={(e) => setFoodCarbs(Number(e.target.value))}
                    />
                    <TextField
                        label="Protein (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={foodProtein || ''}
                        onChange={(e) => setFoodProtein(Number(e.target.value))}
                    />
                    <TextField
                        label="Fat (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={foodFat || ''}
                        onChange={(e) => setFoodFat(Number(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEditFood} color={foodCalories && foodCalories >= 2000 ? "success" : "primary"} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );   
} 

export default FoodJournal;
