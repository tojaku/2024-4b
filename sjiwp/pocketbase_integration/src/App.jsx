import { A, Navigate, Route, Router } from "@solidjs/router";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Show } from "solid-js";

import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Error from "./pages/Error";

export default function App() {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={Home} />
        <Route path="/signin" component={Signin} />
        <Route path="/error" component={Error} />
        <Route path="*" component={() => <Navigate href="/error" />} />
      </Router>
    </AuthProvider>
  );
}

function Layout(props) {
  const user = useAuth();

  return (
    <>
      <header class="flex flex-row gap-2 items-center p-2">
        <div class="flex-none">Zaglavlje</div>
        <nav class="flex-1 text-right">
          <Show when={user()}>
            Odjava
          </Show>
          <Show when={!user()}>
            <A class="p-2 bg-amber-500 text-gray-50 font-bold rounded hover:brightness-90" href="/signin">Prijava</A>
          </Show>
        </nav>
      </header>

      <main>{props.children}</main>

      <footer>Podnožje</footer>
    </>
  );
}
