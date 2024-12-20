import { onMount } from "solid-js";
import { supabase } from "../services/supabase";

export default function TestFunction(props) {

    onMount(async () => {
        const { data, error } = await supabase.functions.invoke('hello-world', {
            body: { name: 'Pero' }
        });
        console.log(data, error);

    });

    return (
        <>
            Test
        </>
    );

}