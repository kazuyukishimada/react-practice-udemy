import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatmonth } from '../utils/formatting';
import { Transaction } from '../types';

const useMonthlyTransactions = (): Transaction[] => {
    const { transactions, currentMonth } = useAppContext();
    // 月の取引データを取得
    const monthlyTransactions = useMemo(() =>
      transactions.filter((transaction) =>
        transaction.date.startsWith(formatmonth(currentMonth))
      )
    , [transactions, currentMonth]); // 依存配列が変更されたタイミングで再計算される

    return monthlyTransactions;
}

export default useMonthlyTransactions