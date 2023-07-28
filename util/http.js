import axios from "axios";

const BACKEND_URL =
  "https://react-native-course-981a9-default-rtdb.firebaseio.com/";

export async function storeExpense(expenseData) {
  const response = await axios.post(
    BACKEND_URL + "/expenses.json",
    expenseData
  );
  const id = response.data.name;
  return id;
}

export async function fetchExpenses() {
  const response = await axios.get(BACKEND_URL + "/expenses.json");
  console.log(response.data);
  const expenses = [];
  for (const key in response.data) {
    const expenseObject = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };

    expenses.push(expenseObject);
  }
  return expenses;
}

export async function updateExpense(id, expensData) {
  return axios.put(BACKEND_URL + `/expenses/${id}.json`, expensData);
}
export function deleteExpense(id) {
  return axios.delete(BACKEND_URL + `/expenses/${id}.json`);
}
