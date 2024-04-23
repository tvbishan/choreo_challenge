import React, { useState, useEffect } from 'react';
import { expenseGroups } from '../expenseGroups';
import { TextField, MenuItem, Button, CircularProgress } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ExpenseForm = ({ userDetails, doOpenSnackbar, onExpenseActionSuccess }) => {
	
    const [amount, setAmount] = useState('');
    const [expenseGroup, setExpenseGroup] = useState('');
	const [note, setNote] = useState('');
    const [expenseDate, setExpenseDate] = useState(null);
    const [errors, setErrors] = useState({
        amount: '',
        expenseGroup: '',
        note: '',
        expenseDate: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateExpenseForm = () => {
        let formErrors = { amount: '', expenseGroup: '', note: '', expenseDate: '' };
        let formIsValid = true;

        // Check if amount is empty or less than or equal to 0
		if (!amount || parseFloat(amount) <= 0) {
            formErrors.amount = 'An amount is required and cannot be less than or equal to 0.';
            formIsValid = false;
        }

        if (!expenseGroup) {
            formErrors.expenseGroup = 'Please select an expense category.';
            formIsValid = false;
        }

        if (!note) {
            formErrors.note = 'Note is required.';
            formIsValid = false;
        }

        if (!expenseDate) {
            formErrors.expenseDate = 'Date is required.';
            formIsValid = false;
        }

        setErrors(formErrors);
        return formIsValid;
    };

    const doSubmit = async (e) => {
        e.preventDefault();
        if (!validateExpenseForm()) return;

        setIsSubmitting(true);

        const expenseDetails = {
            amount,
            expenseGroup,
            note,
            expenseDate,
            email: userDetails.email, // Include the email of logged in user to track expense by user
        };

        try {
            //await bookAppointment(expenseDetails);
            doOpenSnackbar('Expense recorded successfully!');

            onExpenseActionSuccess();

            // Reset form fields
			setAmount('');
            setExpenseGroup('');
            setNote('');
            setExpenseDate(null);
        } catch (error) {
            console.error('Expense action failed:', error);
            doOpenSnackbar('Failed to record the Expense. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
	
	// Function to get today's date
	const getTodayDate = () => {
	  const today = new Date();
      today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
	  return today;
	};	

    return (
        <form onSubmit={doSubmit} style={{ width: '100%' }}>
		
            <TextField
                label="Amount"
				type="number"
				variant="outlined"
                margin="normal"				
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
				fullWidth
				InputProps={{
				  inputProps: { min: 0, step: '0.01'  }, // Allow only non-negative values and Allow up to 2 decimal places
				}}				
                error={!!errors.amount}
                helperText={errors.amount}                
            />
			
            <TextField
                select
                label="Expense Category"
                variant="outlined"
                margin="normal"				
                value={expenseGroup}
                onChange={(e) => setExpenseGroup(e.target.value)}
				fullWidth
                error={!!errors.expenseGroup}
                helperText={errors.expenseGroup}
            >
                {expenseGroups.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
			
            <TextField
                label="Note"
                variant="outlined"
                margin="normal"				
                value={note}
                onChange={(e) => setNote(e.target.value)}
				fullWidth
                error={!!errors.note}
                helperText={errors.note}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Expense Date"
                    value={expenseDate}
					defaultValue={getTodayDate()} 
					maxDate={getTodayDate()} // Set maxDate to today's date
                    onChange={(e) => setExpenseDate(e)}
                    slotProps={{
                        textField: {
                            variant: 'outlined',
                            fullWidth: true,
                            margin: 'normal',
                            error: !!errors.expenseDate,
                            helperText: errors.expenseDate,
                        }
                    }}
                />
            </LocalizationProvider>			

            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20, position: 'relative' }} disabled={isSubmitting}>
                Record Expense
                {isSubmitting && (
                    <CircularProgress
                        size={24}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: -12,
                            marginLeft: -12,
                        }}
                    />
                )}
            </Button>
        </form>
    );
};

export default ExpenseForm;
