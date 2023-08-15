import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="w-full h-screen p-4 flex flex-col bg-slate-900">
      <Toaster />
      <Outlet />
    </div>
  );
}

export default App;
