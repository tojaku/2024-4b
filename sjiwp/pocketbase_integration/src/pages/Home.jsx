import { createSignal, onMount, For, Show } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { pb } from "../services/pocketbase";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";

export default function Home() {
    const user = useAuth();

    const [items, setItems] = createSignal([]);
    const [error, setError] = createSignal(false);
    const [errorDs, setErrorDs] = createSignal(false); // duplicate signup
    const [errorNs, setErrorNs] = createSignal(false); // not signed up

    onMount(async () => {
        await load();
    });

    async function load() {
        setError(false);
        try {
            const result = await pb.collection("events").getFullList({
                sort: "-created",
            });
            setItems(result);
        } catch (error) {
            console.log(error);
            setError(true);
        }
    }

    async function signup(item) {
        setError(false);
        setErrorDs(false);
        try {
            const data1 = {
                user: user().id,
                event: item.id
            };
            await pb.collection("seats").create(data1);

            const data2 = {
                usedSeats: item.usedSeats + 1
            };
            const updated = await pb.collection("events").update(item.id, data2);

            setItems(old => old.map(el => {
                if (el.id === updated.id) {
                    return { ...item, ...updated };
                }
                return el;
            }));
        } catch (error) {
            if (error.data?.data?.event?.code === "validation_not_unique") {
                setErrorDs(true);
            } else {
                console.log(error);
                setError(true);
            }
        }
    }

    async function signout(item) {
        setError(false);
        setErrorNs(false);
        try {
            const toDelete = await pb.collection("seats").getFirstListItem(`user="${user().id}" && event="${item.id}"`);

            await pb.collection("seats").delete(toDelete.id);

            const data = {
                usedSeats: item.usedSeats - 1
            };
            const updated = await pb.collection("events").update(item.id, data);

            setItems(old => old.map(el => {
                if (el.id === updated.id) {
                    return { ...item, ...updated };
                }
                return el;
            }));
        } catch (error) {
            if (error.data?.code === 404) {
                setErrorNs(true);
            } else {
                console.log(error);
                setError(true);
            }
        }
    }

    return (
        <div class="p-2">
            <div class="text-3xl font-mono font-bold p-2">Prijavite se na događaj</div>

            <Show when={error()}>
                <AlertMessage type="error" message="Dogodila se greška, provjerite podatke." />
            </Show>

            <Show when={errorDs()}>
                <AlertMessage type="error" message="Već ste prijavljeni na odabrani događaj." />
            </Show>

            <Show when={errorNs()}>
                <AlertMessage type="error" message="Ne možete se odjaviti, jer niste prijavljeni." />
            </Show>

            <For each={items()}>
                {(item, index) => (
                    <div class="flex flex-row items-center gap-2 w-full p-4 rounded bg-amber-100 mb-2">
                        <div class="flex-1">
                            <div class="text-2xl">{item.name}</div>
                            <div class="line-clamp-3 text-xs">{item.details}</div>
                        </div>
                        <div class="flex flex-col">
                            <div>{new Date(item.start).toLocaleDateString("hr")}</div>
                            <div class="text-[0.5em]">Početak</div>
                        </div>
                        <div class="flex flex-col">
                            <div>{item.usedSeats}/{item.maxSeats}</div>
                            <div class="text-[0.5em]">Popunjenost</div>
                        </div>
                        <div class="flex flex-row gap-1">
                            <Show when={user()}>
                                <Show when={item.usedSeats < item.maxSeats}>
                                    <span onClick={async () => await signup(item)}><Button label="Prijava" /></span>
                                </Show>
                                <span onClick={async () => await signout(item)}><Button label="Odjava" color="bg-red-400" /></span>
                            </Show>
                        </div>
                    </div>
                )}
            </For>
        </div>
    );
}