import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log("🔥 spinavatar is running");

    const provider = new AvatarProvider(context);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("avatarView", provider)
    );
}

class AvatarProvider implements vscode.WebviewViewProvider {

    constructor(private context: vscode.ExtensionContext) { }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        console.log("📦 avatarView RESOLVED");

        const webview = webviewView.webview;

        webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, "media")
            ]
        };

        const imgUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, "media", "picture.jpg")
        );

        webview.html = this.getHtml(imgUri.toString());
    }

    getHtml(image: string) {
        return `
<!DOCTYPE html>
<html>
<head>
<style>

body {
    margin: 0;
    overflow: hidden;
    background: transparent;
}

#avatar {
    position: absolute;
    width: 100px;
    cursor: grab;
    left: 40px;
    top: 40px;
    animation: spin 4s linear infinite;
}

#avatar.dragging {
    animation-duration: 0.5s;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

</style>
</head>
<body>

<img id="avatar" src="${image}" />

<script>

const avatar = document.getElementById("avatar");

let x = 40;
let y = 40;
let dx = 2;
let dy = 2;
let dragging = false;

function loop() {
    if (!dragging) {
        x += dx;
        y += dy;

        const maxX = window.innerWidth - avatar.offsetWidth;
        const maxY = window.innerHeight - avatar.offsetHeight;

        if (x <= 0 || x >= maxX) dx *= -1;
        if (y <= 0 || y >= maxY) dy *= -1;

        avatar.style.left = x + "px";
        avatar.style.top = y + "px";
    }
    requestAnimationFrame(loop);
}

loop();

avatar.addEventListener("mousedown", () => {
    dragging = true;
    avatar.classList.add("dragging");
});

document.addEventListener("mouseup", () => {
    dragging = false;
    avatar.classList.remove("dragging");
    dx = (Math.random() - 0.5) * 12;
    dy = (Math.random() - 0.5) * 12;
});

document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    x = e.clientX - avatar.offsetWidth / 2;
    y = e.clientY - avatar.offsetHeight / 2;
    avatar.style.left = x + "px";
    avatar.style.top = y + "px";
});

</script>
</body>
</html>`;
    }
}

export function deactivate() { }