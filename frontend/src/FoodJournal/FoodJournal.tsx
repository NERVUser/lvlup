import React, { useState, useEffect } from 'react';
import './FoodJournal.css';
import { Button, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, CircularProgress, LinearProgress, Box, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers';
import { useAddMeal, useGetUserMeals, useDeleteMeal, useEditMeal } from '../lib/supabase';
import { useGlobalContext } from '../context/GlobalProvider';
import { format } from 'date-fns';
import MealComponent from '../components/MealComponent';

interface MealProps {
    id: string;
    created_at: string;
    name: string; 
    quantity: string; 
    calories: number; 
    carbs: number; 
    protein: number; 
    fats: number;
}

function FoodJournal() {
    const calorieGoal = 2000;
    const carbsGoal = 300;
    const proteinGoal = 250;
    const fatGoal = 100;
    
    const [calorieIntake, setCalorieIntake] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [breakfastItems, setBreakfastItems] = useState<MealProps[]>([]);
    const [lunchItems, setLunchItems] = useState<MealProps[]>([]);
    const [dinnerItems, setDinnerItems] = useState<MealProps[]>([]);
    const [newMealForm, setNewMealForm] = useState({
        currentMeal: 'breakfast',
        foodName: '',
        foodQuantity: '',
        foodCalories: 0,
        foodCarbs: 0,
        foodProtein: 0,
        foodFat: 0,
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [selectedMeal, setSelectedMeal] = useState<MealProps | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);

    const caloriePercentage = (calorieIntake / calorieGoal) * 100;
    const carbsPercentage = (totalCarbs / carbsGoal) * 100;
    const proteinPercentage = (totalProtein / proteinGoal) * 100;
    const fatPercentage = (totalFat / fatGoal) * 100;

    const { user } = useGlobalContext();
    const { data: userMeals } = useGetUserMeals(user?.id);
    const { mutate: addMeal } = useAddMeal();
    const { mutate: deleteMeal } = useDeleteMeal();
    const { mutate: editMeal } = useEditMeal();

    useEffect(() => {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        if (userMeals) {
            const breakfast: MealProps[] = [];
            const lunch: MealProps[] = [];
            const dinner: MealProps[] = [];
            let totalCalories = 0;
            let totalCarbs = 0;
            let totalProtein = 0;
            let totalFat = 0;

            userMeals
                .filter((meal) => meal.created_at === formattedDate)
                .forEach((meal) => {
                if (meal.meal_type === 'breakfast') {
                  breakfast.push(meal);
                } else if (meal.meal_type === 'lunch') {
                  lunch.push(meal);
                } else if (meal.meal_type === 'dinner') {
                  dinner.push(meal);
                }
                totalCalories += meal.calories || 0;
                totalCarbs += meal.carbs || 0;
                totalProtein += meal.protein || 0;
                totalFat += meal.fats || 0;
            });

            setBreakfastItems(breakfast);
            setLunchItems(lunch);
            setDinnerItems(dinner);
            setCalorieIntake(totalCalories);
            setTotalCarbs(totalCarbs);
            setTotalProtein(totalProtein);
            setTotalFat(totalFat);
        }
    }, [selectedDate, userMeals]);

    const handleAddFood = (meal: 'breakfast' | 'lunch' | 'dinner') => {
        setNewMealForm({...newMealForm, currentMeal: meal});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewMealForm({
            currentMeal: 'breakfast',
            foodName: '',
            foodQuantity: '',
            foodCalories: 0,
            foodCarbs: 0,
            foodProtein: 0,
            foodFat: 0,
        });
    };

    const handleSaveFood = async () => {
        if (newMealForm.foodName === '' || newMealForm.foodQuantity === '')
            return alert("Please fill in all fields");

        setCalorieIntake(calorieIntake + (newMealForm.foodCalories || 0));
        setTotalCarbs(totalCarbs + (newMealForm.foodCarbs || 0));
        setTotalProtein(totalProtein + (newMealForm.foodProtein || 0));
        setTotalFat(totalFat + (newMealForm.foodFat || 0));

        addMeal({
            name: newMealForm.foodName,
            calories: newMealForm.foodCalories,
            protein: newMealForm.foodProtein,
            carbs: newMealForm.foodCarbs,
            fats: newMealForm.foodFat,
            quantity: newMealForm.foodQuantity,
            meal_type: newMealForm.currentMeal,
            user_id: user?.id,
        });

        handleCloseDialog();
    };

    const handleEditMeal = (meal: MealProps) => {
        setSelectedMeal(meal);
        setEditDialogOpen(true);
    };

    const handleDeleteMeal = (mealId: string) => {
        deleteMeal({ id: mealId });
    };

    const handleSaveEditMeal = () => {
        if (selectedMeal) {
            editMeal(selectedMeal);
            setEditDialogOpen(false);
        }
    };

    const handleOpenCalendarDialog = () => {
        setCalendarDialogOpen(true);
    };

    const handleCloseCalendarDialog = () => {
        setCalendarDialogOpen(false);
    };

    return (
        <div className="food-journal-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="header" style={{ textAlign: 'center' }}>
                <Box sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ marginBottom: '10px' }} variant='h4'>Meals on {format(selectedDate, 'MMM d, yyyy')}</Typography>
                    <Button variant="contained" onClick={handleOpenCalendarDialog}>
                        Select Date
                    </Button>
                </Box>
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
                        color={totalCarbs >= carbsGoal ? "success" : "primary"}
                    />
                    <p style={{ color: totalCarbs >= carbsGoal ? '#4caf50' : '#1976d2', marginBottom: '10px' }}>{totalCarbs}g</p>

                    <p style={{ color: '#ccc' }}>Protein</p>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(proteinPercentage, 100)}
                        color={totalProtein >= proteinGoal ? "success" : "primary"}
                    />
                    <p style={{ color: totalProtein >= proteinGoal ? '#4caf50' : '#1976d2', marginBottom: '10px' }}>{totalProtein}g</p>

                    <p style={{ color: '#ccc' }}>Fat</p>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(fatPercentage, 100)}
                        color={totalFat >= fatGoal ? "success" : "primary"}
                    />
                    <p style={{ color: totalFat >= fatGoal ? '#4caf50' : '#1976d2', marginBottom: '10px' }}>{totalFat}g</p>
                </div>
            </div>

            {/* Meal Sections */}
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
                <Card key={meal} className="meal-section" sx={{ marginBottom: '20px', padding: '10px', width: '80%' }}>
                    <CardContent>
                        <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '15px' }}>
                            {meal.charAt(0).toUpperCase() + meal.slice(1)}
                        </Typography>
                        <List>
                            {(meal === 'breakfast' ? breakfastItems : meal === 'lunch' ? lunchItems : dinnerItems).map((item) => (
                                <Card key={item.id} sx={{ marginBottom: '10px', textAlign: 'left', padding: '15px' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Typography variant="body1" fontWeight="bold" sx={{ marginBottom: '5px' }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ marginBottom: '5px' }}>
                                                {item.quantity}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', flexWrap: 'wrap' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ marginRight: '10px' }}>
                                                Calories: {item.calories} Cals
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ marginRight: '10px' }}>
                                                Carbs: {item.carbs}g
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ marginRight: '10px' }}>
                                                Protein: {item.protein}g
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Fat: {item.fats}g
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
                                            <IconButton onClick={() => handleEditMeal(item)} sx={{ color: 'grey.500' }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteMeal(item.id)} sx={{ color: 'grey.500' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </List>
                        <Button startIcon={<AddCircleOutlineIcon />} variant="contained" className="add-food-button" onClick={() => handleAddFood(meal as 'breakfast' | 'lunch' | 'dinner')} fullWidth>
                            Add Food
                        </Button>
                    </CardContent>
                </Card>
            ))}
    
            {/* Add Food Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add Food Item</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Food Name"
                        fullWidth
                        margin="dense"
                        value={newMealForm.foodName}
                        onChange={(e) => setNewMealForm({...newMealForm, foodName: e.target.value})}
                    />
                    <TextField
                        label="Quantity (e.g., 100g, 1 cup)"
                        fullWidth
                        margin="dense"
                        value={newMealForm.foodQuantity}
                        placeholder="e.g., 100g, 1 cup"
                        onChange={(e) => setNewMealForm({...newMealForm, foodQuantity: e.target.value})}
                    />
                    <TextField
                        label="Calories"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newMealForm.foodCalories || ''}
                        onChange={(e) =>setNewMealForm({...newMealForm, foodCalories: Number(e.target.value)})}
                    />
                    <TextField
                        label="Carbs (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newMealForm.foodCarbs || ''}
                        onChange={(e) => setNewMealForm({...newMealForm, foodCarbs: Number(e.target.value)})}
                    />
                    <TextField
                        label="Protein (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newMealForm.foodProtein || ''}
                        onChange={(e) => setNewMealForm({...newMealForm, foodProtein: Number(e.target.value)})}
                    />
                    <TextField
                        label="Fats (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newMealForm.foodFat || ''}
                        onChange={(e) => setNewMealForm({...newMealForm, foodFat: Number(e.target.value)})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveFood} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Meal Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Food Item</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Food Name"
                        fullWidth
                        margin="dense"
                        value={selectedMeal?.name || ''}
                        onChange={(e) => setSelectedMeal((prev) => prev ? {...prev, name: e.target.value} : null)}
                    />
                    <TextField
                        label="Quantity (e.g., 100g, 1 cup)"
                        fullWidth
                        margin="dense"
                        value={selectedMeal?.quantity || ''}
                        onChange={(e) => setSelectedMeal((prev) => prev ? {...prev, quantity: e.target.value} : null)}
                    />
                    <TextField
                        label="Calories"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={selectedMeal?.calories || ''}
                        onChange={(e) => setSelectedMeal((prev) => prev ? {...prev, calories: Number(e.target.value)} : null)}
                    />
                    <TextField
                        label="Carbs (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={selectedMeal?.carbs || ''}
                        onChange={(e) => setSelectedMeal((prev) => prev ? {...prev, carbs: Number(e.target.value)} : null)}
                    />
                    <TextField
                        label="Protein (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={selectedMeal?.protein || ''}
                        onChange={(e) => setSelectedMeal((prev) => prev ? {...prev, protein: Number(e.target.value)} : null)}
                    />
                    <TextField
                        label="Fats (g)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={selectedMeal?.fats || ''}
                        onChange={(e) => setSelectedMeal((prev) => prev ? {...prev, fats: Number(e.target.value)} : null)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEditMeal} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );   
} 

export default FoodJournal;
