const ConsoleAPI = window.ConsoleAPI;

let autoScroll = true;

const root = document.getElementById('root')!;
root.addEventListener('scroll', () => {
    if (root.scrollHeight - (root.clientHeight + root.scrollTop) === 0) {
        autoScroll = true;
    } else {
        autoScroll = false;
    }
});
ConsoleAPI.onData((_, data: string) => {
    root.appendChild(document.createTextNode(data));
    if (autoScroll) root.scroll(0, root.scrollHeight);
});