import { Router, Route, A } from "@solidjs/router";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Show } from "solid-js";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";

export default function App() {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={Home} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signout" component={SignOut} />
      </Router>
    </AuthProvider>
  );
}

function Layout(props) {
  const appName = import.meta.env.VITE_APP_NAME;
  const session = useAuth();

  return (
    <div class="p-4 flex flex-col gap-4">

      <div>
        <div class="text-4xl text-neutral-500 uppercase">
          {appName}
        </div>
        <div class="flex gap-2">
          <A href="/" class="bg-orange-400 p-2 rounded hover:bg-red-300">Naslovnica</A>
          <Show when={!session()}>
            <A href="/signin" class="bg-orange-400 p-2 rounded hover:bg-red-300">Prijava</A>
          </Show>
          <Show when={session()}>
            <A href="/signout" class="bg-orange-400 p-2 rounded hover:bg-red-300">Odjava</A>
          </Show>
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