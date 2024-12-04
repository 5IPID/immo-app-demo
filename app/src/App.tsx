
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import { OneColumnLayout } from "./layout/OneColumnLayout";
import Users from "./pages/Users";


/*
let datas = {
  title: 'Mon Titre',
  buttonProducts: 'Products',
  buttonSignIn: 'Sign in',
  buttonRegister: 'Register'
}
*/
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OneColumnLayout/>}>
          <Route path="/product" element={<Product/>}/>
          <Route path="/users" element={<Users/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default App;
