
/*
    code to easily pick from a sample of color schemes

    This site has endless possibilities for color schemes:
    https://color.adobe.com/trends
*/


const themes = ["architecture", "botanico", "gnome", "piday"]

const themeColors = {
    // name     body bg,     body fg, #now bg,  #now fg, #bigpi Decoration
    "architecture":
    ["4F818C", "01260A", "01260A", "F2A007", "590202"],
    
    "botanico":
    ["7ABF85", "5888A6", "484A73", "BFB3A4", "776AA6"],

    "gnome":
    ["A66D05", "0D0D0D", "2D3773", "F25D07", "8C8304"],

    "piday":
    ["618C80", "F2D338", "F28705", "F24130", "F28705"],

    }

const numThemes = themes.length

const THEME_BACKGROUND = 0
const THEME_FOREGROUND = 1
const THEME_NOW_BG     = 2
const THEME_NOW_FG     = 3
const THEME_BIG_PI     = 4

currentTheme = themeColors["piday"]

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
    theme = themeColors[themeName]

    currentTheme = theme

    document.body.style.backgroundColor = "#"+theme[THEME_BACKGROUND]
    document.body.style.color = "#"+theme[THEME_FOREGROUND]
    

    document.getElementById("pidigits").style.color = "#"+theme[THEME_FOREGROUND]

    document.getElementById("now").style.backgroundColor = "#"+theme[THEME_NOW_BG]
    document.getElementById("now").style.color = "#"+theme[THEME_NOW_FG]

    document.getElementById("bigpi").style.backgroundColor = "#"+theme[THEME_BACKGROUND]
    document.getElementById("bigpi").style.color = "#"+theme[THEME_BIG_PI]

    currentTheme = theme

}

function pickRandomTheme() {
    themeIndex = Math.floor(Math.random() * numThemes);
    setTheme(themeIndex)
}