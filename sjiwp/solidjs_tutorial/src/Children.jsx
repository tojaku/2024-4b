export default function Children() {
    return (
        <>
            <Local>
                <p>Ja sam dijete 1</p>
                <p>Ja sam dijete 2</p>
                <p>Ja sam dijete 3</p>
                <p>Ja sam dijete 4</p>
                <p>Ja sam dijete 5</p>
            </Local>
        </>
    );
}

function Local(props) {

    return (
        <>
            <h2>Ovo su moja djeca:</h2>
            <div style="background-color: violet; padding: 10px;">
                {props.children}
            </div>
        </>
    );

}