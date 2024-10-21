import { createSignal, For, Index } from "solid-js";

export default function Flow() {
    const [users, setUsers] = createSignal([
        { id: "4234234235", name: "Pero Perić" },
        { id: "4352345465", name: "Ana Anić" },
        { id: "8635767876", name: "Ivo Ivić" },
        { id: "0345387754", name: "Marko Marić" },
    ]);

    return (
        <div>
            <ul>
                <For each={users()}>
                    {
                        (user, i) =>
                            <li>
                                /{i}/ {user.id}: {user.name}
                            </li>
                    }
                </For>
            </ul>
            <ul>
                <Index each={users()}>
                    {
                        (user, i) =>
                            <li>
                                /{i}/ {user().id}: {user().name}
                            </li>
                    }
                </Index>
            </ul>
        </div>
    );
}