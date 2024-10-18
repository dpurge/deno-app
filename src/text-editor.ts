import { WebUI } from "https://deno.land/x/webui/mod.ts";

async function close(e: WebUI.Event) {
  console.log("Exit.");
  WebUI.exit();
}

const w = new WebUI();
w.setRootFolder("text-editor");
w.bind("__close-btn", close);

w.showBrowser("index.html", WebUI.ChromiumBased).catch((error) => {
  console.log("Warning: Install a Chromium-based web browser for an optimized experience.");
  w.show("index.html");
});

await WebUI.wait();
