import React from 'react';
import { Box, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const MonthSelector = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", gap: 2}}>
        <Button color={"error"} variant="contained">
          先月
        </Button>
        <DatePicker />
        <div style={{ margin: "0 10px" }}>日付選択(後で作成)</div>
        <Button color={"primary"} variant="contained">
          翌月
        </Button>
      </Box>
    </LocalizationProvider>
  )
}

export default MonthSelector
