import { createResource, For } from "solid-js";
import { getCountries } from "../services/supabase";
import { useAuth } from "../components/AuthProvider";

export default function Home(props) {
    const [countries] = createResource(getCountries);
    const session = useAuth();

    return (
        <div>
            <div class="text-2xl font-bold">Naslovnica</div>
            <div>Države u bazi podataka:</div>
            <ul>
                <For each={countries()} fallback={<li>Trenutno nema država</li>}>
                    {country =>
                        <li>
                            {country.name}
                        </li>
                    }
                </For>
            </ul>
            <div>Korisnik: {session() ? "prijavljen" : "nije prijavljen"}</div>
        </div>
    );
}