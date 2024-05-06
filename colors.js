
/*
    code to easily pick from a sample of color schemes

    This site has endless possibilities for color schemes:
    https://color.adobe.com/trends
*/


const themes = ["architecture", "botanico", "gnome", "piday", "clockcase"]

const themeColors = {
    // name     body bg,     body fg, #now bg,  #now fg, #bigpi Decoration, seconds
    "architecture":
               ["#4F818C", "#01260A", "#590202", "#F2A007", "#590202", "#F2A007"],
    
    "botanico":
                ["#7ABF85", "#5888A6", "#484A73", "#BFB3A4", "#776AA6", "black"],

    "gnome":
                ["#A66D05", "#0D0D0D", "#2D3773", "#F25D07", "#8C8304", "#F25D07"],

    "piday":
                ["#618C80", "#F2D338", "#F28705", "#F24130", "#F28705", "#F24130"],

    "clockcase": 
                ["#1d4149", "#1c9e41", "black", "#8f3b1f", "#8f3b1f", "black"],

    }

const numThemes = themes.length

const THEME_BACKGROUND = 0
const THEME_FOREGROUND = 1
const THEME_NOW_BG     = 2
const THEME_NOW_FG     = 3
const THEME_BIG_PI     = 4
const THEME_SECONDS    = 5

currentTheme = themeColors["piday"]

function setSecondsThemeHighlighted (id) {
    el = document.getElementById(id)
    el.style.color = currentTheme[THEME_SECONDS]
}

function setSecondsThemeUnhighlighted (id) {
    el = document.getElementById(id)
    el.style.color = currentTheme[THEME_FOREGROUND]
}

function updateColors() {
    document.body.style.backgroundColor = currentTheme[THEME_BACKGROUND]
    document.body.style.color = currentTheme[THEME_FOREGROUND]
    

    document.getElementById("pidigits").style.color = currentTheme[THEME_FOREGROUND]

    document.getElementById("now").style.backgroundColor = currentTheme[THEME_NOW_BG]
    document.getElementById("now").style.color = currentTheme[THEME_NOW_FG]

    document.getElementById("bigpi").style.backgroundColor = currentTheme[THEME_BACKGROUND]
    document.getElementById("bigpi").style.color = currentTheme[THEME_BIG_PI]
}

function setTheme (theme) {

    if (typeof theme === 'string' && theme instanceof String) {
        themeName = theme
    } else if (Number.isInteger(theme)) {
        themeName = themes[theme]
    } else {
        themeName = themes[0]
    }


    //theme = themeColors["botanico"]
    //theme = themeColors["gnome"]
    //theme = themeColors["piday"]
    //currentTheme = themeColors["clockcase"]

    currentTheme = themeColors[themeName]

    updateColors()

}

function pickRandomTheme() {
    // random but does not repeat previous theme
    do {
        themeIndex = Math.floor(Math.random() * numThemes);
    } while (themeColors[themeIndex] == currentTheme)
    setTheme(themeIndex)
}