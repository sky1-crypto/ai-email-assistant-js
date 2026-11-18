import EmailAssistant from "./components/EmailAssistant";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app">
      <EmailAssistant />
      <EmailHistory />
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;