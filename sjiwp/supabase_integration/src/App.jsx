import { Router, Route } from "@solidjs/router";

import Home from "./pages/Home";

export default function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={Home} />
    </Router>
  );
}

function Layout(props) {
  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <div class="p-4 flex flex-col gap-4">
      
      <div>
        <div class="text-4xl text-neutral-500 uppercase">
          {appName}
        </div>
      </div>

      <div class="min-h-[75vh] w-10/12 mx-auto">
        {props.children}
      </div>

      <div class="text-center text-xs text-neutral-500">
        Sva prava pridržana {new Date().getFullYear()}. Pero i sinovi
      </div>
    </div>
  );
}