
import './App.css'
import { BrowserRouter, Routes , Route } from "react-router-dom";
import DonorSignUp from './components/Credentials/DonorSignUp'
import NGOLogin from './components/Credentials/NGOLogin'
import FooterNav from './components/FooterNav'
import Nearby from './components/nearby'
import PastOrders from './components/PastOrders'
import Payment from './components/Payment'
import Pickups from './components/Pickups'
import NGOSignUp from './components/Credentials/NGOSignUp';
import SurplusList from './SurplusList';
import HomePage from './components/HomePage';
import OlaMaps from './components/DonorLocationsMap';
import DeliveryPage from './components/DeliveryPage';
import DonorDeliveryPage from './components/DonorDeliveryPage';
import "./index.css"
import PickupsComponent from './components/PickupsComponent';
import DonorLocationsMap from './components/DonorLocationsMap';
import DonationRewards from './components/DonationRewards';
import FoodSurplusDonationLandingPage from './components/FoodSurplusDonationLandingPage';


function App() {
  
  return (
    
     
     <BrowserRouter> 
     <Routes> 
      <Route path="/register" element={<DonorSignUp/>}></Route>
      <Route path="/register-ngo" element={<NGOSignUp/>}></Route>
      <Route path="/login" element={<NGOLogin/>}></Route>
      <Route path="/home" element={<HomePage/>}></Route>
      <Route path="/donor-home" element={<FoodSurplusDonationLandingPage/>}></Route>
      <Route path="/list-surplus" element={<SurplusList/>}></Route>
      <Route path="/home/pickups" element={<PickupsComponent/>}></Route>
      <Route path="/home/pastorders" element={<PastOrders/>}></Route>
      <Route path="/home/maps" element={<DonorLocationsMap/>}></Route>
      <Route path="/home/delivery" element={<DeliveryPage/>}></Route>
      <Route path="/donordelivery" element={<DonorDeliveryPage/>}></Route>
      <Route path="/rewards" element={<DonationRewards/>}></Route>

      <Route path="/payment" element={<Payment/>}></Route>

      
     </Routes>
      
     </BrowserRouter>
    
    
     
  )
}

export default App
