import React from 'react'
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { ExpenseCategory, IncomeCategory } from '../../types';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import WaterIcon from '@mui/icons-material/Water';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import WorkIcon from '@mui/icons-material/Work';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import SavingsIcon from '@mui/icons-material/Savings';

const IconComponents: Record<IncomeCategory | ExpenseCategory, React.ReactElement> = {
  食費: <FastfoodIcon fontSize='small'/>,
  日用品: <ShoppingCartIcon fontSize='small'/>,
  住居費: <HomeIcon fontSize='small'/>,
  水道光熱費: <WaterIcon fontSize='small'/>,
  娯楽: <SportsEsportsIcon fontSize='small'/>,
  給与: <WorkIcon fontSize='small'/>,
  副収入: <AddBusinessIcon fontSize='small'/>,
  お小遣い: <SavingsIcon fontSize='small'/>,
}

export default IconComponents