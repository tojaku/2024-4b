export default function Signin() {

    function formSubmit() { }

    return (
        <>
            <div class="text-3xl font-mono font-bold p-2">Prijava korisnika</div>
            <form onSubmit={formSubmit} class="w-md">
                <div class="p-2 flex flex-col gap-1">
                    <label>E-mail</label>
                    <input class="border rounded p-2" type="email" name="email" required="true" />
                </div>

                <div class="p-2 flex flex-col gap-1">
                    <label>Zaporka</label>
                    <input class="border rounded p-2" type="password" name="password" required="true" min="6" />
                </div>

                <div class="p-2 flex flex-col gap-1">
                    <input type="submit" value="Pošalji" class="bg-slate-600 text-white p-2 rounded" />
                </div>
            </form>
        </>);
}