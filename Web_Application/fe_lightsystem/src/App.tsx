import "./App.css";
import Dashboard from "./component/Dashboard";
import CustomizedTables from "./component/Manage_Dashboard";
function App() {
  return (
    <>
      <div>
        <Dashboard></Dashboard>
      </div>
      <div>
        <CustomizedTables></CustomizedTables>
      </div>
    </>
  );
}

export default App;
