import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Transaction } from './types/index';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { formatmonth } from './utils/formatting';
import { Schema } from './validations/schema';

function App() {
  function isFireStoreError(error: unknown): error is {code: string, message: string} {
    return typeof error === "object" && error !== null && "code" in error;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // 全取引データを取得
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Transactions'));
        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });
        setTransactions(transactionsData);
      } catch (error) {
        if (isFireStoreError(error)) {
          console.error(`Firestore Error: ${error.code} - ${error.message}`);
        } else {
          console.error('Error fetching transactions:', error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  // 月の取引データを取得
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatmonth(currentMonth));
  });

  // 保存
  const handleSaveTransaction = async (transaction: Schema) => {
    try {
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction; // 型アサーション

      setTransactions((prevTransaction) => [
        ...prevTransaction,
        newTransaction,
      ]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error(`Firestore Error: ${err.code} - ${err.message}`);
      } else {
        console.error('Error fetching transactions:', err);
      }
    }
  }

  // 更新
  const handleUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      const docRef = doc(db, "Transactions", transactionId);
      await updateDoc(docRef, transaction);
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? {...t, ...transaction} : t // 更新された値で上書き
      ) as Transaction[];
      setTransactions(updatedTransactions as Transaction[]);
    } catch(err) {
      if (isFireStoreError(err)) {
        console.error(`Firestore Error: ${err.code} - ${err.message}`);
      } else {
        console.error('Error fetching transactions:', err);
      }
    }
  }

  // 削除
  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteDoc(doc(db, "Transactions", transactionId));
      const filterdTransactions = transactions.filter(
        (transaction) => transaction.id !== transactionId
      );
      setTransactions(filterdTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error(`Firestore Error: ${err.code} - ${err.message}`);
      } else {
        console.error('Error fetching transactions:', err);
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route
              index
              path="/"
              element={
                <Home
                  monthlyTransactions={monthlyTransactions}
                  setCurrentMonth={setCurrentMonth}
                  onSaveTransaction={handleSaveTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                />
              }
            />
            <Route
              path="/report"
              element={
                <Report
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  monthlyTransactions={monthlyTransactions}
                  isLoading={isLoading}
                />
              }
            />
            <Route path="*" element={<NoMatch />}/>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
