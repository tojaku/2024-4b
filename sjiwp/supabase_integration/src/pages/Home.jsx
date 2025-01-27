import { createEffect, createSignal, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Home(props) {
    const session = useAuth();

    const [projects, setProjects] = createSignal(null);

    createEffect(async () => {
        await loadProjects();
    });

    async function loadProjects() {
        if (session()) {
            const { data, error } = await supabase
                .from("projects")
                .select("*, tasks(count)");
            if (!error) {
                setProjects(data);
            }
        }
    }

    async function deleteProject(projectId) {
        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", projectId);
        if (error) {
            alert("Operacija nije uspjela.");
        } else {
            await loadProjects();
        }
    }

    return (
        <>
            <Show when={!session()}>
                <div class="bg-red-400 text-white text-3xl p-10 rounded">Morate se prijaviti da biste vidjeli projekte!</div>
            </Show>
            <Show when={session() && projects()}>
                <For each={projects()} fallback={<div>Nema projekata.</div>}>
                    {(item) => <div class="flex flex-col gap-2 items-end bg-blue-400 text-white p-2 rounded mb-5">
                        <div class="place-self-start text-xl">{item.name}</div>
                        <div class="place-self-start line-clamp-3">{item.description}</div>
                        <A href={`/tasks/${item.id}`} class="bg-white text-blue-400 p-2 rounded text-sm">
                            Prikaži
                        </A>
                        <Show when={item.tasks[0].count === 0}>
                            <button class="bg-white text-red-400 p-2 rounded text-sm" onClick={() => deleteProject(item.id)}>Briši</button>
                        </Show>
                    </div>}
                </For>
            </Show>
        </>
    );
}