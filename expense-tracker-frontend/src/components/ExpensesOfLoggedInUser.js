import React, { useEffect, useState } from 'react';
import { getExpensesByEmail } from '../services/expesneTrackerService';
import { expenseGroups } from '../expenseGroups';
import { List, ListItem, ListItemText, Typography, Paper, Avatar, ListItemAvatar } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Convert expense groups values to labels for display
const getExpenseGroupLabel = (expenseGroupValue) => {
    const expenseGroup = expenseGroups.find(s => s.value === expenseGroupValue);
    return expenseGroup ? expenseGroup.label : expenseGroupValue; // Fallback to the value if not found
};

const ExpensesOfLoggedInUser = ({ email, triggerRefresh }) => {
    const [expenses, setExpenses] = useState([]);

    const fetchExpenses = async () => {
        if (!email) return;

        try {
            const expensesOfLoggedInUser = await getExpensesByEmail(email);
            setExpenses(expensesOfLoggedInUser);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [email, triggerRefresh]);

    if (expenses.length === 0) {
        return (
            <Typography variant="subtitle1" style={{ marginTop: 20, textAlign: 'center' }}>
                No records found!
            </Typography>
        );
    }

    return (
        <Paper elevation={3} style={{ marginTop: 20, padding: '20px' }}>
            <Typography variant="h6" style={{ marginBottom: 10 }}>
                Expenses
            </Typography>
            <List>
                {expenses.map((expense, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar>
                                <AttachMoneyIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${expense.amount}`}
                            secondary={`On ${getExpenseGroupLabel(expense.expenseGroup)} on ${expense.expenseDate} - ${expense.note}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default ExpensesOfLoggedInUser;