import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tabs from "./components/Tabs/tabs.js";
import Header from "./components/NavBar/NavBar";
import RequestTable from "./components/Request/RequestTable";
import PaymentForm from "./components/PaymentForm/Paymentform";
import Login from "./components/Login/login";
import TransacTable from "./components/TransactionTable/transacTable";
import Paymentpage from "./components/paymentpage/paymentpage";
import MobileInput from "./components/MobileInput/mobileInput";
import LoadingScreen from "./components/Loading Screen/loadingScreen";
import UserProfile from "./components/UserProfile/userProfile";
import Otp from "./components/Otp/Otp";

function App() {
  return (
    <div className="bckTemplate">
      <Header />
      <div className="container">
        <div className="row">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/transactioninfo" element={<Tabs />} />
            <Route path="/transactiontable" element={<TransacTable />} />
            <Route path="/paymentForm/:type" element={<PaymentForm />} />
            <Route path="/request" element={<RequestTable />} />
            <Route path="/payment" element={<Paymentpage />} />
            <Route path="/register" element={<MobileInput />} />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/otp/:mobileNum" element={<Otp />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
