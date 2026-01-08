import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { ExpenseCategory, IncomeCategory, TransactionType } from '../types';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
import useMonthlyTransactions from '../Hooks/useMonthlyTransactions';
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const monthlyTransactions = useMonthlyTransactions();
  const { isLoading } = useAppContext();
  const theme = useTheme();
  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const [selectedType, setSelectedType] = useState<TransactionType>("expense");

  const handleChange = (e: SelectChangeEvent<TransactionType>) => {
    setSelectedType(e.target.value as TransactionType);
  }

  const categorySums = monthlyTransactions
  .filter(
    (transaction) => transaction.type === selectedType
  ).reduce<Record<IncomeCategory | ExpenseCategory, number>>(
    (acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    },
    {} as Record<IncomeCategory | ExpenseCategory, number>
  );

  const categoryLabels = Object.keys(categorySums) as (IncomeCategory | ExpenseCategory)[];
  const categoryValues = Object.values(categorySums);

  // 収入カテゴリの色
  const incomeCategoryColor: Record<IncomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor["給与"],
    副収入: theme.palette.incomeCategoryColor["副収入"],
    お小遣い: theme.palette.incomeCategoryColor["お小遣い"],
  };

  // 支出カテゴリの色
  const expenseCategoryColor: Record<ExpenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor["食費"],
    日用品: theme.palette.expenseCategoryColor["日用品"],
    住居費: theme.palette.expenseCategoryColor["住居費"],
    水道光熱費: theme.palette.expenseCategoryColor["水道光熱費"],
    娯楽: theme.palette.expenseCategoryColor["娯楽"],
  };

  const getCategoryColor = (
    category: IncomeCategory | ExpenseCategory
  ): string => {
    if (selectedType === "income") {
      return incomeCategoryColor[category as IncomeCategory];
    } else {
      return expenseCategoryColor[category as ExpenseCategory];
    }
  }

  const data: ChartData<"pie"> = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryLabels.map((category) => (
          getCategoryColor(category)
        )),
        borderColor: categoryLabels.map((category) => (
          getCategoryColor(category)
        )),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="type-label">収支の種類</InputLabel>
        <Select
          labelId="type-label"
          id="type-select"
          value={selectedType}
          label="収支の種類"
          onChange={handleChange}
        >
          <MenuItem value={"expense"}>支出</MenuItem>
          <MenuItem value={"income"}>収入</MenuItem>
        </Select>
      </FormControl>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 0,
        }}
      >
      {isLoading ? (
        <CircularProgress />
      ) : monthlyTransactions.length > 0 ? (
        <Pie options={options} data={data} />
      ) : (
        <Typography>データがありません</Typography>
      )}
      </Box>
    </Box>
  );
};

export default CategoryChart
