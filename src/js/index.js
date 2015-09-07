import AsteroidsScene from './asteroids/scene';
import Physics from 'PhysicsJS';
import navigation from './navigation';

let active = true;

window.addEventListener('focus', function () {
    active = true;
});

window.addEventListener('blur', function () {
    active = false;
});

document.addEventListener("DOMContentLoaded", function(event) {
	console.log('loaded');
    navigation();
    let scene = new AsteroidsScene();

    //update world
    Physics.util.ticker.on(time => {
        if (scene && active) {
            scene.step(time);
        }
    });

    window.addEventListener('resize', () => {
        console.log('resize');
        scene.destroy();
        let container = document.getElementById('asteroids-canvas');
        if (container.childNodes.length) {
            container.removeChild(container.firstChild);
        }
        scene = new AsteroidsScene();
    });
});