import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import { calclulateDailyBalance } from '../utils/financeCalculations'
import { Balance, CalendarContent, Transaction } from '../types'
import '../calendar.css'
import { formatCurrency } from '../utils/formatting'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { useTheme } from '@mui/material'
import { isSameMonth } from 'date-fns'

interface CalendarProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>,
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>,
  currentDay: string,
  today: string,
}

const Calendar = ({
  monthlyTransactions,
  setCurrentMonth,
  setCurrentDay,
  currentDay,
  today}: CalendarProps) => {
  const theme = useTheme();
  const dailyBalances = calclulateDailyBalance(monthlyTransactions);

  const createCalendarEvents = (dailyBalances: Record<string, Balance>):CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const {income, expense, balance} = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      }
    })
  }

  const calendarEvents = createCalendarEvents(dailyBalances);

  const backgroundEvent = {
    start: currentDay,
    display: 'background',
    backgroundColor: theme.palette.incomeColor.light,
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className='money' id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>
        <div className='money' id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className='money' id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    )
  }

  // 月の日付取得
  const handleDatesSet = (datesetInfo: DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    };
  }

  // 日付を選択した時の処理
  const handleDateclick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
  }

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDatesSet}
      dateClick={handleDateclick}
    />
  )
}

export default Calendar