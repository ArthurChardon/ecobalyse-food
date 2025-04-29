import "./App.css";
import { ProductAttributesProvider } from "./context/ProductAttributesContext";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import { SidebarProvider } from "./components/ui/sidebar";

function App() {
  return (
    <>
      <ProductAttributesProvider>
        <SidebarProvider>
          <RecipeForm></RecipeForm>
        </SidebarProvider>
      </ProductAttributesProvider>
    </>
  );
}

export default App;
