export const expenseGroups = [
    { value: 'electricity', label: 'Electricity' },
    { value: 'telephone', label: 'Telephone' },
    { value: 'internet', label: 'Internet' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'rent', label: 'Rent' },
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals' },
    { value: 'education', label: 'Education' },
];

expenseGroups.sort((a, b) => {
    if (a.label < b.label) {
        return -1;
    }
    if (a.label > b.label) {
        return 1;
    }
    return 0;
});
