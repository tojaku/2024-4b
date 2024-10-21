export default function Events() {

    function handleEvent1(event) {
        console.log(event.clientX, event.clientY);
    }

    return (
        <div>
            <div onMouseMove={handleEvent1}>Test</div>

            <button onClick={() => { alert("Gumb je kliknu!") }}>Klikni me</button>
        </div>
    );
}