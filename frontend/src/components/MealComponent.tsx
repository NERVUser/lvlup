import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItem, ListItemText, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react'
import { useDeleteMeal, useEditMeal } from '../lib/supabase';

type Meal = {
  id: string;
  created_at: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  quantity: string;
}

type MealComponentProps = {
  index: number
  meal: Meal;
}

function MealComponent({ index, meal }: MealComponentProps) {

  const { mutate: deleteMeal } = useDeleteMeal();
  const { mutate: editMeal } = useEditMeal();

  const [localMealForm, setLocalMealForm] = useState<Meal>(meal);
  const [dialogOpen, setDialogOpen] = useState(false);


  const handleEditFood = () => {
    editMeal({
      id: localMealForm.id,
      name: localMealForm.name,
      calories: localMealForm.calories,
      carbs: localMealForm.carbs,
      protein: localMealForm.protein,
      fats: localMealForm.fats,
      quantity: localMealForm.quantity,
    })

    setDialogOpen(false);
  };

  const handleDeleteFood = async () => {
    deleteMeal({
        id: meal.id
    })
    
    // Update totals
    // setCalorieIntake(calorieIntake - deletedItem.calories);
    // setCarbs(carbs - deletedItem.carbs);
    // setProtein(protein - deletedItem.protein);
    // setFat(fat - deletedItem.fats);

    // delete our meal in the backend
};

  return (
    <ListItem key={index} style={{ color: '#ffffff', backgroundColor: '#424242', borderRadius: '8px', marginBottom: '10px', padding: '10px' }}>
        <ListItemText 
          primary={<strong>{meal.name}</strong>} 
          secondary={<span style={{ fontSize: '0.9rem' }}>
          {`${meal.quantity}, Calories: ${meal.calories}\n, 
          Carbs: ${meal.carbs}g\n, 
          Protein: ${meal.protein}g\n, Fats: ${meal.fats}g`}</span>} 
        />
        <IconButton aria-label="edit" onClick={() => setDialogOpen(true)} style={{ color: '#ffffff' }}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDeleteFood} style={{ color: '#ffffff' }}>
          <DeleteIcon />
        </IconButton>
        {/* Edit Food Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Edit Food Item</DialogTitle>
          <DialogContent>
              <TextField
                  label="Food Name"
                  fullWidth
                  margin="dense"
                  value={localMealForm.name}
                  onChange={(e) => setLocalMealForm({...localMealForm, name: e.target.value})}
              />
              <TextField
                  label="Quantity (e.g., 100g, 1 cup)"
                  fullWidth
                  margin="dense"
                  value={localMealForm.quantity}
                  placeholder="e.g., 100g, 1 cup"
                  onChange={(e) => setLocalMealForm({...localMealForm, quantity: e.target.value})}
              />
              <TextField
                  label="Calories"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={localMealForm.calories || ''}
                  onChange={(e) => setLocalMealForm({...localMealForm, calories: Number(e.target.value)})}
              />
              <TextField
                  label="Carbs (g)"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={localMealForm.carbs || ''}
                  onChange={(e) => setLocalMealForm({...localMealForm, carbs: Number(e.target.value)})}
              />
              <TextField
                  label="Protein (g)"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={localMealForm.protein || ''}
                  onChange={(e) => setLocalMealForm({...localMealForm, protein: Number(e.target.value)})}
              />
              <TextField
                  label="Fat (g)"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={localMealForm.fats || ''}
                  onChange={(e) => setLocalMealForm({...localMealForm, fats: Number(e.target.value)})}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setDialogOpen(false)} color="secondary">
                  Cancel
              </Button>
              <Button onClick={handleEditFood} color={localMealForm.calories  >= 2000 ? "success" : "primary"} variant="contained">
                  Save Changes
              </Button>
          </DialogActions>
        </Dialog>
    </ListItem>
  )
}

export default MealComponent