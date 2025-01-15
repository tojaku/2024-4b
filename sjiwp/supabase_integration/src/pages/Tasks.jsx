import { useParams } from "@solidjs/router";
import { onMount } from "solid-js";

export default function Tasks(props) {
    const params = useParams();

    onMount(() => {
        console.log(params.id);
        
    });

    return (
        <>
            <div>Zadaci</div>
        </>
    );
}