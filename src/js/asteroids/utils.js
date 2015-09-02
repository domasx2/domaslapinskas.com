export function getViewport() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height:  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
}

export function radians(degrees) {
    return degrees * (Math.PI / 180);
} 

export function rndInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;  
}