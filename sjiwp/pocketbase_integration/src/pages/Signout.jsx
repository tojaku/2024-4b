import { onMount } from "solid-js";
import { pb } from "../services/pocketbase";

export default function Signout() {

    onMount(async () => {
        pb.authStore.clear();
    });

    return (
        <div class="m-2 p-4 rounded bg-emerald-500 w-md">
            Uspješno ste se odjavili.
        </div>
    );
}