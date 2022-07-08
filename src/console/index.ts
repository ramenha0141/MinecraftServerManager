const ConsoleAPI = window.ConsoleAPI;

const root = document.getElementById('root')!;
ConsoleAPI.onData((_, data: string) => root.appendChild(document.createTextNode(data)));