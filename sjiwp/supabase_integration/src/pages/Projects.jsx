import { createSignal, Show } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Projects(props) {
    const session = useAuth();

    const [success, setSuccess] = createSignal(false);

    async function formSubmit(event) {
        setSuccess(false);
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get("name");
        const description = formData.get("description");
        const author_id = session().user.id;

        const { error } = await supabase
            .from("projects")
            .insert({
                name: name,
                ...(description !== "" ? { description: description } : {}),
                author_id: author_id
            });

        if (error) {
            alert("Spremanje nije uspjelo.");
        } else {
            setSuccess(true);
            event.target.reset();
        }
    }

    return (
        <>
            <Show when={success()}>
                <div class="bg-green-400 text-white p-2 rounded my-5">
                    Projekt uspješno spremljen!
                </div>
            </Show>
            
            <form onSubmit={formSubmit}>
                <div class="p-2 flex flex-col gap-1">
                    <label>Naziv:</label>
                    <input type="text" name="name" required="true" />
                </div>

                <div class="p-2 flex flex-col gap-1">
                    <label>Opis:</label>
                    <textarea name="description" class="min-h-60"></textarea>
                </div>

                <div class="p-2 flex flex-col gap-1">
                    <input type="submit" value="Pošalji" class="bg-slate-600 text-white p-2 rounded" />
                </div>
            </form>
        </>
    );
}