import "./App.css";
import { ProductAttributesProvider } from "./context/ProductAttributesContext";
import RecipeForm from "./components/RecipeForm/RecipeForm";

function App() {
  return (
    <>
      <ProductAttributesProvider>
        <RecipeForm></RecipeForm>
      </ProductAttributesProvider>
    </>
  );
}

export default App;
