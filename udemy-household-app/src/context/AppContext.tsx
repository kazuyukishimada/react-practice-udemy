import { createContext, useContext, useState } from "react";
import { Transaction } from "../types";
import { useMediaQuery, useTheme } from "@mui/material";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Schema } from '../validations/schema';
import { db } from "../firebase";
import { isFireStoreError } from "../utils/errorHandling";

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  onSaveTransaction: (transaction: Transaction) => Promise<void>;
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // 保存処理
  const onSaveTransaction = async (transaction: Schema) => {
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

  // 更新処理
  const onUpdateTransaction = async (
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

  // 削除処理
  const onDeleteTransaction = async (
      transactionId: string | readonly string[]
    ) => {
    try {
      const idsToDelete = Array.isArray(transactionId)
        ? transactionId
        : [transactionId];
      for(const id of idsToDelete) {
        await deleteDoc(doc(db, "Transactions", id));
      }
      const filterdTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id)
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
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        isLoading,
        setIsLoading,
        isMobile,
        onSaveTransaction: onSaveTransaction,
        onUpdateTransaction: onUpdateTransaction,
        onDeleteTransaction: onDeleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// カスタムフックでグローバルなデータを取得
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("グローバルなデータはプロバイダーの中で取得してください");
  }
  return context;
}
