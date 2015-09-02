import AsteroidsScene from './asteroids/scene';
import Physics from "PhysicsJS";

document.addEventListener("DOMContentLoaded", function(event) {
	console.log('loaded');
    let scene = new AsteroidsScene();

    //update world
    Physics.util.ticker.on(time => {
        if (scene) {
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