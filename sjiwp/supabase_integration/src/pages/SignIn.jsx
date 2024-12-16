import { createSignal, Show } from "solid-js";
import { supabase } from "../services/supabase";

export default function SignIn(props) {
    const [result, setResult] = createSignal(null);

    async function formSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        const result = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        console.log(result);
        if (result.error) {
            setResult("Dogodila se greška prilikom prijave!");
        } else {
            setResult("Prijava je uspjela.");
        }
    }

    return (
        <>
            <Show when={result()}>
                <div class="bg-slate-300 p-4 rounded">
                    {result()}
                </div>
            </Show>
            <form onSubmit={formSubmit}>
                <div class="p-2 flex flex-col gap-1">
                    <label>E-mail adresa:</label>
                    <input type="email" name="email" required="true" />
                </div>

                <div class="p-2 flex flex-col gap-1">
                    <label>Zaporka:</label>
                    <input type="password" name="password" required="true" min="6" />
                </div>

                <div class="p-2 flex flex-col gap-1">
                    <input type="submit" value="Pošalji" class="bg-slate-600 text-white p-2 rounded" />
                </div>
            </form>
        </>
    );
}