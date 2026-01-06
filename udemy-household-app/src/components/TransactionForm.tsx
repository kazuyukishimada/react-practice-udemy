import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import WaterIcon from "@mui/icons-material/Water";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import WorkIcon from "@mui/icons-material/Work";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SavingsIcon from "@mui/icons-material/Savings";
import { ExpenseCategory, IncomeCategory, Transaction } from "../types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../validations/schema";
import { Schema } from "../validations/schema";

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  selectedTransaction: Transaction | null;
  onDeleteTransaction: (transactionId: string) => Promise<void>;
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
}

type IncomeExpense = "income" | "expense";

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: React.ReactElement;
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  onSaveTransaction,
  selectedTransaction,
  onDeleteTransaction,
  setSelectedTransaction,
  onUpdateTransaction,
}: TransactionFormProps) => {
  const formWidth = 320;

  const incomeCategories: CategoryItem[] = [
    {label: "給与", icon: <WorkIcon fontSize='small'/>},
    {label: "副収入", icon: <AddBusinessIcon fontSize='small'/>},
    {label: "お小遣い", icon: <SavingsIcon fontSize='small'/>},
  ];

  const expenseCategories: CategoryItem[] = [
    {label: "食費", icon: <FastfoodIcon fontSize='small'/>},
    {label: "日用品", icon: <ShoppingCartIcon fontSize='small'/>},
    {label: "住居費", icon: <HomeIcon fontSize='small'/>},
    {label: "水道光熱費", icon: <WaterIcon fontSize='small'/>},
    {label: "娯楽", icon: <SportsEsportsIcon fontSize='small'/>},
  ];

  const [categories, setCategories] = useState(expenseCategories);

  const {
    control,
    setValue,
    watch,
    formState: {errors},
    handleSubmit,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "" as IncomeCategory | ExpenseCategory,
      content: "",
    },
    resolver: zodResolver(transactionSchema),
  });

  // 収支タイプ切り替え
  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue("type", type);
    setValue("category", "" as IncomeCategory | ExpenseCategory);
  };

  useEffect(() => {
    setValue("date", currentDay);
  }, [currentDay]);

  // 収支タイプを監視
  const currentType = watch("type");
  useEffect(() => {
    const newCategories = currentType === "expense" ? expenseCategories : incomeCategories;
    setCategories(newCategories);
  }, [currentType]);

  // 送信処理
  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
      .then(() => {
        setSelectedTransaction(null);
        // console.log("更新");
      })
      .catch((error) => {
        console.error(error);
      })
    } else {
      onSaveTransaction(data)
      .then(() => {
        // console.log("保存");
      })
      .catch((error) => {
        console.error(error);
      })
    }

    reset({
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "" as IncomeCategory | ExpenseCategory,
      content: "",
    });
  }

  useEffect(() => {
    if (selectedTransaction) {
      const categoryExists = categories.some(
        (category) => category.label === selectedTransaction.category
      );
      setValue("category", categoryExists ? selectedTransaction.category : "");
    }
  }, [selectedTransaction, categories]);

  useEffect(() => {
    if (selectedTransaction) {
      setValue("type", selectedTransaction.type);
      setValue("date", selectedTransaction.date);
      setValue("amount", selectedTransaction.amount);
      setValue("content", selectedTransaction.content);
    } else {
      reset({
        type: "expense",
        date: currentDay,
        amount: 0,
        category: "" as IncomeCategory | ExpenseCategory,
        content: "",
      });
    }
  }, [selectedTransaction]);

  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      setSelectedTransaction(null);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 64,
        right: isEntryDrawerOpen ? formWidth : "-2%",
        width: formWidth,
        height: "100%",
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create("right", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        p: 2,
        boxSizing: "border-box", // ボーダーとパディングをwidthに含める
        boxShadow: "0px 0px 15px -5px #777777",
      }}
    >
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({field}) => {
              return (
                <ButtonGroup fullWidth>
                  <Button
                    onClick={() => incomeExpenseToggle("expense")}
                    variant={field.value === "expense" ? "contained" : "outlined"}
                    color="error"
                    >
                    支出
                  </Button>
                  <Button
                    onClick={() => incomeExpenseToggle("income")}
                    variant={field.value === "income" ? "contained" : "outlined"}
                    color={"primary"}
                  >
                    収入
                  </Button>
                </ButtonGroup>
              );
            }}
          />

          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                label="カテゴリ"
                select
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {categories.map((category, index) => (
                  <MenuItem value={category.label} key={index}>
                    <ListItemIcon>
                      {category.icon}
                    </ListItemIcon>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                label="金額"
                type="number"
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            )}
          />
          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                label="内容"
                type="text"
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            )}
          />
          {/* 保存ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === "income" ? "primary" : "error"}
            fullWidth
          >
            {selectedTransaction ? "更新" : "保存"}
          </Button>
          {/* 削除ボタン */}
          {selectedTransaction && (
            <Button
              variant="outlined"
              color={"secondary"}
              fullWidth
              onClick={() => handleDelete()}
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
export default TransactionForm;
