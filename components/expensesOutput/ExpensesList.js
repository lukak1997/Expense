import { FlatList, Text } from "react-native";
import ExpenseItem from "./ExpenseItem";

const renderExpensItem = (itemData) => {
  return <ExpenseItem {...itemData.item} />;
};
const ExpensesList = ({ expenses }) => {
  return (
    <FlatList
      data={expenses}
      renderItem={renderExpensItem}
      keyExtractor={(item) => item.id}
    />
  );
};
export default ExpensesList;
