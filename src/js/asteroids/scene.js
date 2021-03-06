import Physics from "PhysicsJS";
import PIXI from "pixi.js";
import Asteroid from "./asteroid";
import {getViewport, rndInt, radians} from "./utils";

window.PIXI = PIXI;

export default class AsteroidsScene {

    constructor() {

        this.asteroids = new Set();
        this.paused = false;

        Physics(world => {
            this.world = world;

            //setup collision
            world.add( Physics.behavior('body-impulse-response') );
            world.add( Physics.behavior('body-collision-detection') );
            world.add( Physics.behavior('sweep-prune') );

            this.initRenderer();

            this.interval = setInterval(() => {
                if (!this.paused) {
                    this.launchAsteroid();
                }
            }, 700);
        });
    }

    step(time) {
        if (!this.paused) {
            this.world.step(time);
            this.world.render();
        }
    }

    pause() {
        this.paused = true;
    }

    unpause() {
        this.paused = false;
    }

    destroy () {
        this.world.destroy();
    }

    initRenderer() {
        let viewport = getViewport();
        this.renderer =  Physics.renderer('pixi', {
            el: 'asteroids-canvas',
            width: viewport.width,
            height: viewport.height,
            meta: false, 
            styles: {
                // set colors for the circle bodies
                'convex-polygon' : {
                    strokeStyle: '0xFFFFFF',
                    lineWidth: 0,
                    fillStyle: '0xE8E8E8'
                }
            }
        });
        this.world.add(this.renderer);

        let pixelRatio = window.devicePixelRatio;
        if (pixelRatio && pixelRatio > 1) {
            let canvas = document.querySelector('#asteroids-canvas canvas');
            canvas.style.transform = 'scale(' + (1 / pixelRatio) +')';
            canvas.style['-webkit-transform'] = 'scale(' + (1 / pixelRatio) +')';
        }
    }

    launchAsteroid() {

        let viewport = getViewport(),
            vmin = Math.min(viewport.width, viewport.height),
            scale_mod = (vmin / 1080),
            side = rndInt(0, 3),
            radius = rndInt(vmin * 0.08, vmin * 0.2),
            mass = (vmin * 0.14) / radius,
            diameter = radius * 2,
            force = (rndInt(1, 10) / 200) * scale_mod,
            x, y, fvec;

        // left
        if (side === 0) {
            y = rndInt(0, viewport.height);
            x = -diameter;
            fvec = new Physics.vector(force, 0);

        //top
        } else if (side === 1) {
            y = -diameter;
            x = rndInt(0, viewport.width);
            fvec = new Physics.vector(0, force);

        //right
        } else if (side === 2) {
            y = rndInt(0, viewport.height);
            x = viewport.width + diameter;
            fvec = new Physics.vector(-force, 0); 

        //bottom
        } else {
            y = viewport.height + diameter;
            x = rndInt(0, viewport.width);
            fvec = new Physics.vector(0, -force);
        }

        //rotate force vector at random angle to create random trajectory
        fvec.rotate(new Physics.transform(null, radians(rndInt(-90, 90)), new Physics.vector(0, 0)));

        let asteroid = new Asteroid(x, y, radius, mass);
        this.asteroids.add(asteroid);

        //aply movement force
        asteroid.body.applyForce(fvec);

        //apply spin force at an orthogonal off-center vector
        asteroid.body.applyForce(new Physics.vector(0, Math.random() > 0.5 ? 0.008 * scale_mod : -0.008 * scale_mod), new Physics.vector(radius, 0));

        this.world.add(asteroid.body);

        //add a check if asteroid is outside of visible viewport; if it is, destroy the asteroid
        let checkIfOutsideViewport = () => {
            let x = asteroid.body.state.pos.x,
                y = asteroid.body.state.pos.y;

            if (
                (x < -diameter)
                ||
                (x > viewport.width + diameter)
                ||
                (y < -diameter)
                ||
                (y > viewport.height + diameter)
            ) {
                this.world.remove(asteroid.body);
                this.world.off('step', checkIfOutsideViewport);
                this.asteroids.delete(asteroid);
            }

        }

        this.world.on('step', checkIfOutsideViewport);
    }

}