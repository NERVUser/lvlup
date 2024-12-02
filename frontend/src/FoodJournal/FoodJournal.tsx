import React, { useState, useEffect } from 'react';
import './FoodJournal.css';
import { Button, IconButton, CircularProgress, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers';
import { useAddMeal, useGetUserMeals } from '../lib/supabase';
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
    fats: number
}

function FoodJournal() {
    // constants we have for comparing actual vs goal
    const calorieGoal = 2000;
    const carbsGoal = 300;
    const proteinGoal = 250;
    const fatGoal = 100;
    

    // these are used to show the user their total cals, carbs, protein, and fats
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
    })
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
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

    // this hook is called whenever our date selected or our meals change
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

            // go through user meals, sort by breakfast, lunch, and dinner
            // then add up our total calories, carbs, proteins, and fats
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
          
                // Accumulate nutrient values
                totalCalories += meal.calories || 0;
                totalCarbs += meal.carbs || 0;
                totalProtein += meal.protein || 0;
                totalFat += meal.fats || 0;
            });

            // Batch update state
            setBreakfastItems(breakfast);
            setLunchItems(lunch);
            setDinnerItems(dinner);
            setCalorieIntake(totalCalories);
            setTotalCarbs(totalCarbs);
            setTotalProtein(totalProtein);
            setTotalFat(totalFat);
            // fetchFoodData(selectedDate);
        }
    }, [selectedDate, userMeals]);

    const fetchFoodData = async (date: Date) => {
        setLoading(true);
        const dateKey = date.toISOString().split('T')[0];
        try {
            // const response = await axios.get(`/api/foodJournal/${dateKey}`);
            // if (response.data) {
            //     setBreakfastItems(response.data.breakfastItems);
            //     setLunchItems(response.data.lunchItems);
            //     setDinnerItems(response.data.dinnerItems);
            //     setCalorieIntake(response.data.calorieIntake);
            //     setCarbs(response.data.carbs);
            //     setProtein(response.data.protein);
            //     setFat(response.data.fat);
            // } else {
            //     resetFoodData();
            // }
        } catch (error) {
            console.error("Error fetching food data:", error);
            resetFoodData();
        } finally {
            setLoading(false);
        }
    };

    // resets all food data
    const resetFoodData = () => {
        setBreakfastItems([]);
        setLunchItems([]);
        setDinnerItems([]);
        setCalorieIntake(0);
        setTotalCarbs(0);
        setTotalProtein(0);
        setTotalFat(0);
    };

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
        })
    };

    const handleSaveFood = async () => {
        if (newMealForm.foodName === '' || newMealForm.foodQuantity === '')
            return alert("Please fill in all fields");

        // idk what this does
        setCalorieIntake(calorieIntake + (newMealForm.foodCalories || 0));
        setTotalCarbs(totalCarbs + (newMealForm.foodCarbs || 0));
        setTotalProtein(totalProtein + (newMealForm.foodProtein || 0));
        setTotalFat(totalFat + (newMealForm.foodFat || 0));

        // use supabase to add our meal in backend
        addMeal({
            name: newMealForm.foodName,
            calories: newMealForm.foodCalories,
            protein: newMealForm.foodProtein,
            carbs: newMealForm.foodCarbs,
            fats: newMealForm.foodFat,
            quantity: newMealForm.foodQuantity,
            meal_type: newMealForm.currentMeal,
            user_id: user?.id,
        })

        handleCloseDialog();
    };

    const handleSaveEditFood = async () => {
        if (editIndex !== null) {
            // const updatedItems = currentMeal === 'breakfast' ? [...breakfastItems] : currentMeal === 'lunch' ? [...lunchItems] : [...dinnerItems];
            // const oldItem = updatedItems[editIndex];
            // updatedItems[editIndex] = {
            //     name: foodName,
            //     quantity: foodQuantity,
            //     calories: foodCalories || 0,
            //     carbs: foodCarbs || 0,
            //     protein: foodProtein || 0,
            //     fat: foodFat || 0,
            // };
            // if (currentMeal === 'breakfast') {
            //     setBreakfastItems(updatedItems);
            // } else if (currentMeal === 'lunch') {
            //     setLunchItems(updatedItems);
            // } else if (currentMeal === 'dinner') {
            //     setDinnerItems(updatedItems);
            // }
            // Update totals
            // setCalorieIntake(calorieIntake - oldItem.calories + (foodCalories || 0));
            // setCarbs(carbs - oldItem.carbs + (foodCarbs || 0));
            // setProtein(protein - oldItem.protein + (foodProtein || 0));
            // setFat(fat - oldItem.fat + (foodFat || 0));

            // handle editing our meal item in backedn

            // reset our fields

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
        <div className="food-journal-container">
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
                    <p style={{ color: totalCarbs >= carbsGoal ? '#4caf50' : '#1976d2' }}>{totalCarbs}g</p>

                    <p style={{ color: '#ccc' }}>Protein</p>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(proteinPercentage, 100)}
                        color={totalProtein >= proteinGoal ? "success" : "primary"}
                    />
                    <p style={{ color: totalProtein >= proteinGoal ? '#4caf50' : '#1976d2' }}>{totalProtein}g</p>

                    <p style={{ color: '#ccc' }}>Fat</p>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(fatPercentage, 100)}
                        color={totalFat >= fatGoal ? "success" : "primary"}
                    />
                    <p style={{ color: totalFat >= fatGoal ? '#4caf50' : '#1976d2' }}>{totalFat}g</p>
                </div>
            </div>

            {/* Meal Sections */}
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
                <div key={meal} className="meal-section">
                    <h2>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h2>
                    <List>
                        {(meal === 'breakfast' ? breakfastItems : meal === 'lunch' ? lunchItems : dinnerItems).map((item, index) => (
                            <MealComponent 
                                index={index} 
                                meal={item} 
                            />
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
                    <Button onClick={handleSaveFood} color={newMealForm.foodCalories >= 2000 ? "success" : "primary"} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );   
} 

export default FoodJournal;
