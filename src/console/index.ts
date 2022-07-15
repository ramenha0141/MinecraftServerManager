const ConsoleAPI = window.ConsoleAPI;

let autoScroll = true;

const output = document.getElementById('output')!;
const input = document.getElementById('input')! as HTMLInputElement;
output.addEventListener('scroll', () => {
    if (output.scrollHeight - (output.clientHeight + output.scrollTop) === 0) {
        autoScroll = true;
    } else {
        autoScroll = false;
    }
});
ConsoleAPI.onData((_, data: string) => {
    output.appendChild(document.createTextNode(data));
    if (autoScroll) output.scroll(0, output.scrollHeight);
});
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        ConsoleAPI.sendCommand(input.value);
        input.value = '';
    }
})