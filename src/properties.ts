const parse = (text: string): {[key: string]: string} => {
    const map: {[key: string]: string} = {};
    const lines = text.split('\n').filter((line) => !/^\s*$/.test(line)).map((line) => line.trim());
    for (const line of lines) {
        if (line[0] === '#') continue;
        const result = line.match(/^(?<name>[^=]+)=(?<value>.*)$/);
        if (!result) continue;
        map[result.groups!.name] = result.groups!.value;
    }
    return map;
};
const stringify = (map: {[key: string]: string}): string => {
    return Object.entries(map).map(([key, value]) => `${key}=${value}`).join('\n');
};
export default {
    parse,
    stringify
};