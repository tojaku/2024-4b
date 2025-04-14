import { useParams } from "@solidjs/router";
import { onMount, createSignal, For, Show } from "solid-js";
import { pb } from "../services/pocketbase";

export default function Signups() {
    const params = useParams();

    const [error, setError] = createSignal(false);
    const [items, setItems] = createSignal([]);
    const [event, setEvent] = createSignal(null);

    onMount(async () => {
        setError(false);
        try {
            const result = await pb.collection("seats").getFullList({
                filter: `event="${params.id}"`,
                sort: "created",
                expand: "user, event"
            });

            setItems(result);
            setEvent(result[0].expand.event);
        } catch (error) {
            console.log(error);
            setError(true);
        }

    });

    return (
        <div class="p-2">
            <div class="text-3xl font-mono font-bold p-2">Prijave na događaj: {event()?.name}</div>

            <Show when={error()}>
                <AlertMessage type="error" message="Dogodila se greška, provjerite podatke." />
            </Show>

            <For each={items()}>
                {(item, index) => (
                    <div class="flex flex-row items-center gap-2 w-full p-4 rounded bg-amber-100 mb-2">
                        <div class="flex-1">
                            <div class="text-2xl">{item.expand.user.name}</div>
                        </div>

                        <div class="flex flex-col">
                            <div>{new Date(item.created).toLocaleDateString("hr")}</div>
                            <div class="text-[0.5em]">Vrijeme prijave</div>
                        </div>
                    </div>
                )}
            </For>
        </div>
    );
}