import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";

export default function Stores() {
    const [db1, setDb1] = createSignal({
        name: "users",
        items: [
            { name: "Pero", surname: "Peric", bill: 100 },
            { name: "Ana", surname: "Anic", bill: 150 },
            { name: "Ivo", surname: "Ivic", bill: 200 },
        ]
    });

    const [db2, setDb2] = createStore({
        name: "users",
        items: [
            { name: "Pero", surname: "Peric", bill: 100 },
            { name: "Ana", surname: "Anic", bill: 150 },
            { name: "Ivo", surname: "Ivic", bill: 200 },
        ]
    });

    function applyTax() {
        let newItems = [];
        for (let i = 0; i < db1().items.length; i++) {
            let element = { ...db1().items[i] };
            element.bill *= 1.25;
            newItems.push(element);
        }
        let newObject = {
            ...db1(),
            ...{ items: newItems }
        };
        setDb1(newObject);
    }

    function applyTax2() {
        const newItems = db2.items.map(element => {
            return { ...element, bill: element.bill *= 1.25 }
        });
        setDb2("items", newItems);
    }

    return (
        <>
            <h1>Korisnici</h1>
            <For each={db1().items}>
                {item => (
                    <div style="margin-bottom: 10px; padding: 10px; border: 1px solid grey;">
                        <div>Ime: {item.name}</div>
                        <div>Prezime: {item.surname}</div>
                        <div>Račun: {item.bill} EUR</div>
                    </div>
                )}
            </For>
            <button onClick={applyTax}>Uračunaj porez</button>

            <h1>Korisnici v2</h1>
            <For each={db2.items}>
                {item => (
                    <div style="margin-bottom: 10px; padding: 10px; border: 1px solid grey;">
                        <div>Ime: {item.name}</div>
                        <div>Prezime: {item.surname}</div>
                        <div>Račun: {item.bill} EUR</div>
                    </div>
                )}
            </For>
            <button onClick={applyTax2}>Uračunaj porez</button>
        </>
    );
}