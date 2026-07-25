let themeIndex = 0;
let accentIndex = 0;
let fontIndex = 0;

function setCookie(name, value, days = 365) {
    const expires = new Date();

    expires.setTime(
        expires.getTime() + (days * 24 * 60 * 60 * 1000)
    );

    document.cookie =
        `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}


function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        cookie = cookie.trim();

        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(
                cookie.substring(name.length + 1)
            );
        }
    }

    return null;
}

const themesList = [
    "dark.css", "light.css", "night.css", "mint.css"
];

const accentsList = [
    "black.css", "blue.css", "green.css", "lime.css",
    "orange.css", "red.css", "white.css", "yellow.css"
];

const fontsList = [
    "comic.css", "mono.css", "serif.css", "system.css"
];

const themeAccentRules = {
    "dark.css": {
        notAllowed: ["black.css", "green.css"],
        default: "white.css"
    },

    "light.css": {
        notAllowed: ["white.css", "yellow.css", "orange.css", "lime.css"],
        default: "black.css"
    },

    "night.css": {
        notAllowed: ["black.css", "green.css", "red.css"],
        default: "white.css"
    },

    "mint.css": {
        notAllowed: ["white.css", "yellow.css", "orange.css", "lime.css", "blue.css"],
        default: "black.css"
    }
};

function isAccentIncompatible(accentFile) {
    const currentTheme = themesList[themeIndex];
    const rules = themeAccentRules[currentTheme];

    if (!rules) {
        return false;
    }

    return rules.notAllowed.includes(accentFile);
}

function setDefaultAccent() {
    const currentTheme = themesList[themeIndex];
    const rules = themeAccentRules[currentTheme];

    if (!rules) {
        return;
    }

    const defaultIndex = accentsList.indexOf(rules.default);

    if (defaultIndex === -1) {
        return;
    }

    accentIndex = defaultIndex;

    document.getElementById("accent-var").href =
        "../static/css/accent/" + accentsList[accentIndex];

    setCookie("accent", accentsList[accentIndex]);
}

function switchTheme() {
    themeIndex++;

    if (themeIndex >= themesList.length) {
        themeIndex = 0;
    }

    document.getElementById("theme-var").href =
        "../static/css/theme/" + themesList[themeIndex];

    setCookie("theme", themesList[themeIndex]);

    if (isAccentIncompatible(accentsList[accentIndex])) {
        setDefaultAccent();
    }
}

function switchAccent() {
    let attempts = 0;

    do {
        accentIndex++;

        if (accentIndex >= accentsList.length) {
            accentIndex = 0;
        }

        attempts++;

    } while (
        isAccentIncompatible(accentsList[accentIndex]) &&
        attempts < accentsList.length
    );

    document.getElementById("accent-var").href =
        "../static/css/accent/" + accentsList[accentIndex];

    setCookie("accent", accentsList[accentIndex]);
}

function switchFont() {
    fontIndex++;

    if (fontIndex >= fontsList.length) {
        fontIndex = 0;
    }

    document.getElementById("font-var").href =
        "../static/css/font/" + fontsList[fontIndex];

    setCookie("font", fontsList[fontIndex]);
}

function loadSavedSettings() {

    const savedTheme = getCookie("theme");
    const savedAccent = getCookie("accent");
    const savedFont = getCookie("font");


    if (savedTheme && themesList.includes(savedTheme)) {
        themeIndex = themesList.indexOf(savedTheme);
    }

    if (savedAccent && accentsList.includes(savedAccent)) {
        accentIndex = accentsList.indexOf(savedAccent);
    }

    if (savedFont && fontsList.includes(savedFont)) {
        fontIndex = fontsList.indexOf(savedFont);
    }

    document.getElementById("theme-var").href =
        "../static/css/theme/" + themesList[themeIndex];


    if (isAccentIncompatible(accentsList[accentIndex])) {
        setDefaultAccent();
    } else {
        document.getElementById("accent-var").href =
            "../static/css/accent/" + accentsList[accentIndex];
    }

    document.getElementById("font-var").href =
        "../static/css/font/" + fontsList[fontIndex];
}

loadSavedSettings();