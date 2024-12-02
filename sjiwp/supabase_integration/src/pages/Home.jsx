import { createResource, For } from "solid-js";
import { getCountries } from "../services/supabase";

export default function Home(props) {
    const [countries] = createResource(getCountries);

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
        </div>
    );
}