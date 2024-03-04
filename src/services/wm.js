function generateHash(uid) {
    const allowedCharCodes = [
        33, ...Array.from({ length: (38 - 35 + 1) }, (_, i) => i + 35),
        ...Array.from({ length: (43 - 42 + 1) }, (_, i) => i + 42),
        45, ...Array.from({ length: (57 - 48 + 1) }, (_, i) => i + 48),
        ...Array.from({ length: (91 - 59 + 1) }, (_, i) => i + 59),
        ...Array.from({ length: (95 - 93 + 1) }, (_, i) => i + 93),
        ...Array.from({ length: (126 - 98 + 1) }, (_, i) => i + 98),
    ];

    let hash = '';
    for (let i = 0; i < 4; i++) {
        const charCode = uid.charCodeAt(i % uid.length);
        const index = charCode % allowedCharCodes.length;
        const hashCharCode = allowedCharCodes[index];
        hash += String.fromCharCode(hashCharCode);
    }
    console.log(hash)
}

const uid = "hQQZ6v88iroSDf4OlG3i";

generateHash(uid);
