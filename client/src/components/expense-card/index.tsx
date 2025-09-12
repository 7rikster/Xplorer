"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface Expense {
  id: string;
  createdAt: string;
  amount: number;
  title: string;
  userId: string;
}

function ExpenseCard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [addExpenseLoading, setAddExpenseLoading] = useState<boolean>(false);
  const [newExpense, setNewExpense] = useState<{
    title: string;
    amount: string;
  }>({
    title: "",
    amount: "",
  });
  useState<number>(0);
  const [user] = useAuthState(auth);

  async function handleAddExpense() {
    if (!user) return;
    if (!newExpense.title || !newExpense.amount) {
      toast("Please fill in all fields.");
      return;
    }
    if (
      isNaN(parseFloat(newExpense.amount)) ||
      parseFloat(newExpense.amount) <= 0
    ) {
      toast("Please enter a valid amount greater than 0.");
      return;
    }


    try {
      setAddExpenseLoading(true);
      const token = await user.getIdToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/expense/create`,
        {
          title: newExpense.title,
          amount: parseFloat(newExpense.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewExpense({ title: "", amount: "" });
      toast("Expense added successfully!");
      fetchExpenses();
      setAddExpenseOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
    finally {
      setAddExpenseLoading(false);
    }
  }

  async function fetchExpenses() {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/expense/get-user-expenses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const expenses: Expense[] = response.data.data;
      setExpenses(expenses);

      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpenses(total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-2xl font-semibold">Total Expense</h1>
      <h1 className="text-4xl font-semibold">$ {totalExpenses.toFixed(2)}</h1>
      <div className="mt-2 flex gap-2">
        <Button
          variant={"outline"}
          className=" cursor-pointer"
          onClick={() => setAddExpenseOpen(true)}
        >
          Add Expense
        </Button>

        <Button
          variant={"outline"}
          className="cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          View Details
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl h-70 sm:h-100 px-2 sm:px-4 flex flex-col items-start justify-center">
          <DialogHeader className="flex items-center justify-center text-center w-full">
            <DialogTitle >
              Your Expense History
            </DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-y-auto w-full">
            <ScrollArea className="h-full">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {expenses && expenses.length > 0
                ? expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="p-2 sm:p-4 border-b last:border-b-0 flex justify-between items-center"
                    >
                      <h1>{expense.title} Plan</h1>
                      <h1 className="text-lg font-semibold">
                        ${expense.amount.toFixed(2)}
                      </h1>
                      <h1 className="text-end">
                        {new Date(expense.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </h1>
                    </div>
                  ))
                : !loading && (
                    <div className="p-4">
                      <h1 className="text-center">
                        You have not made any expenses yet.
                      </h1>
                    </div>
                  )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={addExpenseOpen}
        onOpenChange={() => {
          setAddExpenseOpen(false);
          setNewExpense({ title: "", amount: "" });
        }}
      >
        <DialogContent className="sm:max-w-lg px-2 sm:px-4 flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle className="text-center">Add Expense</DialogTitle>
          </DialogHeader>
          <div className="w-full grid grid-cols-4 gap-3">
            <Label htmlFor="title" className="col-span-1">
              Title
            </Label>
            <Input
              className="col-span-3"
              value={newExpense.title}
              onChange={(e) =>
                setNewExpense({ ...newExpense, title: e.target.value })
              }
              id="title"
              name="title"
              placeholder="Expense Title"
            />
            <Label htmlFor="amount" className="col-span-1">
              Amount (in $)
            </Label>
            <Input
              className="col-span-3"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              id="amount"
              name="amount"
              // type="number"
              placeholder="Expense Amount"
            />
          </div>
          <DialogFooter className="flex items-center justify-center gap-4 w-full mx-auto text-center">
            <Button
              variant={"outline"}
              onClick={() => setAddExpenseOpen(false)}
              className="cursor-pointer"
              disabled={addExpenseLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddExpense} className="cursor-pointer" disabled={addExpenseLoading}>
              {addExpenseLoading ? <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Add Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ExpenseCard;
