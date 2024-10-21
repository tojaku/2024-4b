import { createSignal } from "solid-js";

export default function Forms(props) {
    const [secondNumber, setSecondNumber] = createSignal();

    function submit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const number = formData.get("number");
        console.log("Upisali ste broj: " + number);
        setSecondNumber(number);
    }

    return (
        <div>
            <form onSubmit={submit}>
                <input type="text" name="number" />
                <input type="submit" value="Potvrdi" />
            </form>



            <input type="number" value={secondNumber()} onInput={(event) => setSecondNumber(event.target.value)} />

            <div>Drugi broj je: {secondNumber()}</div>
        </div>

    );
}