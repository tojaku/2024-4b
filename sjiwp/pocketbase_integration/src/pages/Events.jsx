import { createSignal, Show, For, onMount, createEffect } from "solid-js";
import { pb } from "../services/pocketbase";
import { useAuth } from "../components/AuthProvider";
import AlertMessage from "../components/AlertMessage";
import Button from "../components/Button";
import { A } from "@solidjs/router";

export default function Events(props) {
    const user = useAuth();

    const [success, setSuccess] = createSignal(false);
    const [error, setError] = createSignal(false);
    const [items, setItems] = createSignal([]);
    const [selected, setSelected] = createSignal(null);

    onMount(async () => {
        await load();
    });

    createEffect(() => {
        if (success() === true) {
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }
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

    async function deleteItem(item) {
        setError(false);
        try {
            await pb.collection("events").delete(item.id);
            await load();
        } catch (error) {
            console.log(error);
            setError(true);
        }
    }

    function updateItem(item) {
        setSelected(null);
        setSelected(item);
    }

    async function formSubmit(event) {
        event.preventDefault();

        setSuccess(false);
        setError(false);

        const formData = new FormData(event.target);
        const name = formData.get("name");
        const details = formData.get("details");
        const start = formData.get("start");
        const maxSeats = formData.get("maxSeats");

        try {
            const data = {
                name: name,
                details: details,
                start: new Date(start),
                maxSeats: maxSeats,
                author: user().id
            };

            if (selected()) {
                await pb.collection("events").update(selected().id, data);
                setSelected(null);
            } else {
                await pb.collection("events").create(data);
            }

            await load();
            setSuccess(true);

            event.target.reset();
        } catch (error) {
            console.log(error);
            setError(true);
        }
    }

    return (
        <>
            <div class="text-3xl font-mono font-bold p-2">Događaji</div>

            <Show when={success()}>
                <AlertMessage message="Operacija uspješno izvršena" />
            </Show>

            <Show when={error()}>
                <AlertMessage type="error" message="Dogodila se greška, provjerite podatke." />
            </Show>

            <div class="flex flex-row flex-wrap-reverse gap-2">

                <form onSubmit={formSubmit} class="w-md flex-none">
                    <div class="p-2 flex flex-col gap-1">
                        <label>Naziv</label>
                        <input class="border rounded p-2" type="text" name="name" required="true" minLength="3" maxLength="100" value={selected() ? selected().name : ""} />
                    </div>

                    <div class="p-2 flex flex-col gap-1">
                        <label>Opis</label>
                        <textarea class="border rounded p-2 h-40" name="details" required="true" minLength="3" maxLength="1000" value={selected() ? selected().details : ""}></textarea>
                    </div>

                    <div class="p-2 flex flex-col gap-1">
                        <label>Početak</label>
                        <input class="border rounded p-2" type="datetime-local" name="start" required="true" value={selected() ? new Date(selected().start).toISOString().slice(0, 16) : ""} />
                    </div>

                    <div class="p-2 flex flex-col gap-1">
                        <label>Maksimalni broj mjesta</label>
                        <input class="border rounded p-2" type="number" name="maxSeats" step="1" min="1" required="true" value={selected() ? selected().maxSeats : ""} />
                    </div>

                    <div class="p-2 flex flex-row gap-1">
                        <input type="submit" value="Pošalji" class="flex-1 bg-slate-600 text-white p-2 rounded" />
                        <input type="reset" value="Poništi" class="flex-1 bg-slate-300 text-white p-2 rounded" />
                    </div>
                </form>

                <div class="flex-1 p-2">
                    <For each={items()}>
                        {(item, index) => (
                            <div class="flex flex-row items-center gap-2 w-full p-4 rounded bg-amber-100 mb-2">
                                <div class="flex-1">
                                    <div class="text-2xl hover:invert-50"><A href={`/signups/${item.id}`}>{item.name}</A></div>
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
                                    <span onClick={() => updateItem(item)}><Button label="Uredi" /></span>
                                    <span onClick={async () => await deleteItem(item)}><Button label="Obriši" color="bg-red-400" /></span>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </>
    );
}