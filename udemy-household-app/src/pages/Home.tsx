import React, { useState } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material';
import MonthlySummary from '../components/MonthlySummary';
import Calendar from '../components/Calendar';
import TransactionMenu from '../components/TransactionMenu';
import TransactionForm from '../components/TransactionForm';
import { Transaction } from '../types/index';
import { format } from 'date-fns';
import { Schema } from '../validations/schema';
import { DateClickArg } from '@fullcalendar/interaction';

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>,
  onSaveTransaction: (transaction: Schema) => Promise<void>,
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>,
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>,
}

const Home = ({
  monthlyTransactions,
  setCurrentMonth,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
}: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const[currentDay, setCurrentDay] = useState(today);
  const[isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);

  // 選択中の取引データ
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1日分のデータを取得
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  })

  const closeForm = () => {
    setSelectedTransaction(null);
    if (isMobile) {
      setIsDialogOpen(!isDialogOpen);
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  }

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      if (selectedTransaction) {
        setSelectedTransaction(null);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }
  }

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      setIsEntryDrawerOpen(true);
    }
  }

  // 日付を選択した時の処理
  const handleDateclick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
    setIsMobileDrawerOpen(true);
  }

  // モバイル用Drawerを閉じる処理
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  }

  return (
    <Box sx={{ display: 'flex'}}>
      {/* 左コンテンツ */}
      <Box sx={{flexGrow: 1, width: '100%'}}>
        <MonthlySummary monthlyTransactions={monthlyTransactions}/>
        <Calendar
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
          onDateclick={handleDateclick}
        />
      </Box>
      {/* 右コンテンツ */}
      <Box sx={{flexGrow: 1}}>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          isMobile={isMobile}
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <TransactionForm
          onCloseForm={closeForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
          onDeleteTransaction={onDeleteTransaction}
          setSelectedTransaction={setSelectedTransaction}
          onUpdateTransaction={onUpdateTransaction}
          isMobile={isMobile}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  )
}

export default Home
