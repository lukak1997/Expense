import { View, StyleSheet } from "react-native";
import { useLayoutEffect, useContext, useState } from "react";
import IconButton from "../components/Ui/IconButton";
import { GlobalStyles } from "../constans/styles";

import { ExpensesContext } from "../store/Expenses-context";
import ExpenseForm from "../components/manageEsxpense/ExpenseForm";
import { storeExpense, updateExpense, deleteExpense } from "../util/http";
import LoadingOverlay from "../components/Ui/LoadingOverlay";
import ErrorOverlay from "../components/Ui/ErrorOverlay";

const ManageExpense = ({ route, navigation }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const expensesCtx = useContext(ExpensesContext);
  const editedExpenseID = route.params?.expensId;
  const isEditing = !!editedExpenseID;

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseID
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit EXpense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpensHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpense(editedExpenseID);
      expensesCtx.deleteExpense(editedExpenseID);
      navigation.goBack();
    } catch (error) {
      setError("Could not delete expense - please try again later");
      setIsSubmitting(false);
    }
  }

  const cancelHandler = () => {
    navigation.goBack();
  };

  async function confirmHandler(expensData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        expensesCtx.updateExpense(editedExpenseID, expensData);
        await updateExpense(editedExpenseID, expensData);
      } else {
        const id = await storeExpense(expensData);
        expensesCtx.addExpense({ ...expensData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later");
      setIsSubmitting(false);
    }
  }
  function errorHandler() {
    setError(null);
  }
  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }
  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onCancel={cancelHandler}
        onSubmit={confirmHandler}
        defaultValues={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={37}
            onPress={deleteExpensHandler}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
export default ManageExpense;
