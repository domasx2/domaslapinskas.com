import Physics from "PhysicsJS";
import PIXI from "pixi.js";
import Asteroid from "./asteroid";
import {getViewport, rndInt, radians} from "./utils";

window.PIXI = PIXI;

export default class AsteroidsScene {

    constructor() {

        this.asteroids = new Set();

        Physics(world => {
            this.world = world;

            //setup collision
            world.add( Physics.behavior('body-impulse-response') );
            world.add( Physics.behavior('body-collision-detection') );
            world.add( Physics.behavior('sweep-prune') );

            this.initRenderer();

            this.interval = setInterval(() => {
                this.launchAsteroid();
            }, 1000);
        });
    }

    step(time) {
        this.world.step(time);
        this.world.render();
    }

    destroy () {
        this.world.destroy();
    }

    initRenderer() {
        this.renderer =  Physics.renderer('pixi', {
            el: 'asteroids-canvas',
            autoResize: true,
            meta: true, 
            styles: {
                // set colors for the circle bodies
                'convex-polygon' : {
                    strokeStyle: '0xFFFFFF',
                    lineWidth: 1,
                    fillStyle: '0xD9D9D9'
                }
            }
        });
        this.world.add(this.renderer);
    }

    launchAsteroid() {

        let viewport = getViewport(),
            vmin = Math.min(viewport.width, viewport.height),
            side = rndInt(0, 3),
            radius = rndInt(vmin * 0.08, vmin * 0.2),
            mass = (vmin * 0.14) / radius,
            diameter = radius * 2,
            force = (rndInt(1, 10) / 200),
            x, y, fvec;

        // left
        if (side === 0) {
            y = rndInt(0, viewport.height);
            x = -radius;
            fvec = new Physics.vector(force, 0);

        //top
        } else if (side === 1) {
            y = -radius;
            x = rndInt(0, viewport.width);
            fvec = new Physics.vector(0, force);

        //right
        } else if (side === 2) {
            y = rndInt(0, viewport.height);
            x = viewport.width + radius;
            fvec = new Physics.vector(-force, 0); 

        //bottom
        } else {
            y = viewport.height + radius;
            x = rndInt(0, viewport.width);
            fvec = new Physics.vector(0, -force);
        }

        //rotate force vector at random angle to create random trajectory
        fvec.rotate(new Physics.transform(null, radians(rndInt(-90, 90)), new Physics.vector(0, 0)));

        let asteroid = new Asteroid(x, y, radius, mass);
        this.asteroids.add(asteroid);

        //aply movement force
        asteroid.body.applyForce(fvec);

        //apply spin force
        asteroid.body.applyForce(new Physics.vector(0, Math.random() > 0.5 ? 0.008 : -0.008), new Physics.vector(radius, 0));

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