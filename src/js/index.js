import {} from 'pbind';
import AsteroidsScene from './asteroids/scene';
import Physics from 'PhysicsJS';
import navigation from './navigation';
import {getViewport} from './asteroids/utils';

const delta_resize = 60;
let viewport = getViewport();

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
        let new_viewport = getViewport();

        if (Math.abs(new_viewport.width - viewport.width) > delta_resize  || Math.abs(new_viewport.height - viewport.height) > delta_resize) {
            viewport = new_viewport;
            scene.destroy();
            let container = document.getElementById('asteroids-canvas');
            if (container.childNodes.length) {
                container.removeChild(container.firstChild);
            }
            scene = new AsteroidsScene();
        }
    });
});