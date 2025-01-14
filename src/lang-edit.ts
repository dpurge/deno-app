import { parse as parseFlags, Args } from "https://deno.land/std@0.200.0/flags/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { WebUI } from "https://deno.land/x/webui@2.5.1/mod.ts";

const version = "0.1";
const rootFolder = path.join(path.dirname(path.fromFileUrl(import.meta.url)), 'lang-edit');

function parseArguments(args: string[]): Args {
    const booleanArgs = [
        "help",
        "version",
    ];

    const stringArgs = [
        "ime",
    ];

    const alias = {
        "help": "h",
        "version": "v",
        "ime": "i",
    };

    return parseFlags(args, {
        alias,
        boolean: booleanArgs,
        string: stringArgs,
        stopEarly: false,
        "--": false,
    });
}

function printHelp(): void {
    console.log(`Usage: lang-edit [OPTIONS] <filename>`);
}

function printVersion(): void {
    console.log('Version:', version);
}

async function save(e: WebUI.Event) {
    const filename = await e.window.script("return getFilename()").catch((error) => {
        console.error(`Error getting filename: ${error}`);
        return;
    });

    const text = await e.window.script("return getText()").catch((error) => {
        console.error(`Error getting text: ${error}`);
        return;
    });

    try {
        await Deno.writeTextFile(filename, text);
        console.log('Saved: ', filename);
    } catch (err) {
        console.log("Error saving {filename}: ", err );
    }

}

async function load(e: WebUI.Event) {
    const filename = await e.window.script("return getFilename()").catch((error) => {
        console.error(`Error getting filename: ${error}`);
        return;
    });

    let text = '';

    try {
        text = await Deno.readTextFile(filename);
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
          throw err;
        }
        console.log('New file: ', filename );
    }

    e.window.run(`setText(\`${text.replace(/\`/g, '\\\`')}\`);`);
}

async function exit(e: WebUI.Event) {
    console.log("Exit...");
    WebUI.exit();
}


async function main(inputArgs: string[]): Promise<void> {
    const args = parseArguments(inputArgs);

    if (args.help) {
        printHelp();
        Deno.exit(0);
    }

    if (args.version) {
        printVersion();
        Deno.exit(0);
    }

    if (args._?.length != 1) {
        console.log(`%c${"Specify file to edit!\n"}`, `color: red`);
        printHelp();
        Deno.exit(1);
    }

    let ime: string | null = args.ime;
    let filename: string = path.resolve(args._[0]);

    if (ime) {
        try {
            await Deno.lstat(path.join(rootFolder, 'ime', `${ime}.json`));
        } catch (err) {
            if (!(err instanceof Deno.errors.NotFound)) {
                throw err;
            }
            console.log(`IME does not exist: ${ime}`);
            Deno.exit(2);
        }
    }

    const w = new WebUI();
    w.setRootFolder(rootFolder);
    w.bind("save", save);
    w.bind("load", load);
    w.bind("exit", exit);
    w.show("index.html");
    if (ime) {
        w.run(`setIME("${ime}");`);
    }
    w.run(`setFilename("${filename.replace(/\\/g, '\\\\')}");`);
    await WebUI.wait();
}

await main(Deno.args);
