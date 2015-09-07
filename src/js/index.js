import {} from 'pbind';
import AsteroidsScene from './asteroids/scene';
import Physics from 'PhysicsJS';
import navigation from './navigation';

document.addEventListener("DOMContentLoaded", function(event) {
	console.log('loaded');
    navigation();
    let scene, active = true;

    window.addEventListener('focus', function () {
        active = true;
        if (scene) {
            scene.unpause();
        }
    });

    window.addEventListener('blur', function () {
        active = false;
        scene.pause();
    });

    if (!window._phantom) {
        scene = new AsteroidsScene();

        if (!active) {
            scene.pause();
        }

        //update world
        Physics.util.ticker.on(time => {
            scene.step(time);
        });
    }

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