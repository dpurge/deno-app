import { parse as parseFlags, Args } from "https://deno.land/std@0.200.0/flags/mod.ts";
// import { parse as parseYaml, stringify } from "https://deno.land/std@0.200.0/yaml/mod.ts";
// import { YamlLoader } from "https://deno.land/x/yaml_loader/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { WebUI } from "https://deno.land/x/webui/mod.ts";

const version = "0.1";
const rootFolder = path.join(path.dirname(path.fromFileUrl(import.meta.url)), 'lang-edit');

function parseArguments(args: string[]): Args {
    const booleanArgs = [
        "help",
        "version",
    ];

    const stringArgs = [
        // "lang",
        "ime",
    ];

    const alias = {
        "help": "h",
        "version": "v",
        // "lang": "l",
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

// async function loadIME(e: WebUI.Event) {
//     const name = e.arg.string(0);
//     const yamlLoader = new YamlLoader();
//     const ime = await yamlLoader.parseFile(path.join(rootFolder, 'ime', `${name}.yaml`));
//     console.log(ime.name);
//     return ime;
// }

async function save(e: WebUI.Event) {
    const filename = await e.window.script("return getFilename()").catch((error) => {
        console.error(`Error getting filename: ${error}`);
        return;
    });

    const text = await e.window.script("return getText()").catch((error) => {
        console.error(`Error getting text: ${error}`);
        return;
    });

    console.log("Saving to", filename, ":", text);
}

// async function copy(e: WebUI.Event) {
//     console.log("Copy...");
// }

async function load(e: WebUI.Event) {
    let text = 'Ala ma "psa"!';
    e.window.run(`setText("${text.replace(/"/g, '\\"')}");`);
}

async function exit(e: WebUI.Event) {
    console.log("Exit...");
    WebUI.exit();
}


async function main(inputArgs: string[]): Promise<void> {
    const args = parseArguments(inputArgs);

    // console.dir(args);

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

    // let lang: string | null = args.lang;
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
    // w.bind("loadIME", loadIME);
    w.show("index.html");
    if (ime) {
        w.run(`setIME("${ime}");`);
    }
    // w.run('changeIME();');
    w.run(`setFilename("${filename.replace(/\\/g, '\\\\')}");`);
    await WebUI.wait();
}

await main(Deno.args);
