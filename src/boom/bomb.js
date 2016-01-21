import './bomb.css';
import BombTemplate from './bomb_template.js';
import logger from './logger.js';

let COLORS = ['red', 'green', 'blue', 'orange', 'brown', 'cyan'];
let COUNTER = 0;

const TRANSLATE_REGEX = /translate\((.+)px,\s+(.+)px\)/;
const ROTATE_REGEX = /rotate\((.+)deg\)/;

class ExplodableElement {
    constructor(el, bomb, additive) {
        this.el = el;
        additive = additive ? additive : false;
        let scale = bomb.state.scale;

        // determine how far away we are from the bomb
        let currentPos = this.el.getBoundingClientRect();
        let myX = currentPos.left + (currentPos.width / 2);
        let myY = currentPos.top + (currentPos.height / 2);
        let xDiff = myX - bomb.getBombLocation().x;
        let yDiff = myY - bomb.getBombLocation().y;
        let diff = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

        // determine how far we are going to travel
        // it's inversely proportional to it's distance from the bomb
        let newDiff = ((1 / diff) * 1000) * scale;

        let calcPos = function(axisDiff, otherAxisDiff) {
            let axisMag = Math.abs((axisDiff / otherAxisDiff));
            let diff = newDiff * axisMag;
            logger.debug(`axisMag: ${axisMag} newDiff: ${newDiff} diff: ${diff}`);

            if (axisDiff < 0) {
                diff = -1 * diff;
            }

            return diff;
        };

        this.newX = calcPos(xDiff, yDiff);
        this.newY = calcPos(yDiff, xDiff);

        if (newDiff > 8) {
            this.randDeg = (Math.random() * 10) * newDiff;
        } else {
            this.randDeg = 0;
        }

        this.duration = 0.1 + (Math.random() * 0.5);
        if (additive && this.el.style.transform.length > 0) {
            // we don't want to butcher existing tranforms
            let oldTransform = this.el.style.transform;

            if (oldTransform.match(TRANSLATE_REGEX)) {
                this.newX += parseFloat(oldTransform.match(TRANSLATE_REGEX)[1]);
                this.newY += parseFloat(oldTransform.match(TRANSLATE_REGEX)[2]);
            }

            if (oldTransform.match(ROTATE_REGEX)) {
                this.randDeg += parseFloat(oldTransform.match(ROTATE_REGEX)[1]);
            }
        }

        /*
        this.el.style.backgroundColor = COLORS[COUNTER];
        this.color = COLORS[COUNTER];
        COUNTER += 1;
        */

        logger.debug(`color ${this.color} is moving diff ${newDiff} as its ${diff} far away`);
    }

    explode() {
        this.el.style.transition = `ease-out ${this.duration}s all`;
        this.el.style.transform = `translate(${this.newX}px, ${this.newY}px) rotate(${this.randDeg}deg)`;
        // this.el.style.transform = `translate(${this.newX}px, ${this.newY}px)`;
    }
}

export const BombDefaults = {
    'size': 60, // in px
    'transitionSpeed': 0.25, // in seconds
    'inert': false,
    'additive': true,
};

// FIXME make these settings
const MIN_SIZE = 30;
const BLOW_UP_TIME = 1000;

export class Bomb {
    constructor(opts={}) {
        logger.debug('bomb init');

        // base settings of BombDefaults
        this.settings = Object.assign(BombDefaults);

        // then change any that are defined in opts
        for (let key in opts) {
            // if this isn't a defined default we warn
            // that this setting probably has no point
            if (!BombDefaults.hasOwnProperty(key)) {
                console.warn(`you passed in ${key} to the constructor that is not a valid setting`);
            }

            this.settings[key] = opts[key];
        }

        this.state = {};
        this.state.scale = 1;
        this.listeners = {};
    }

    createBomb() {
        // FIXME do we even need a document fragment here?
        let range = document.createRange();
        let bombFrag = range.createContextualFragment(BombTemplate);

        // assign a position to the container
        let bombEl = Bomb.getBomb(bombFrag);
        bombEl.classList.add('dropped');
        bombEl.classList.add('full-size');
        bombEl.style.width = `${this.settings.size}px`;
        bombEl.style.height = `${this.settings.size}px`;

        console.log("settings", this.settings);
        if (this.settings.inert === false) {
            this.listeners.handleMouseMove = this.handleMouseMove.bind(this);
            this.listeners.handleClick = this.dropBomb.bind(this);
            this.listeners.handleMouseScroll = this.handleMouseScroll.bind(this);

            window.addEventListener('mousemove', this.listeners.handleMouseMove);
            window.addEventListener('wheel', this.listeners.handleMouseScroll);
            bombEl.addEventListener('click', this.listeners.handleClick);


            this.state.rafCall = window.requestAnimationFrame(this.refreshBomb.bind(this));
        }

        this.state.bomb = bombEl;
        return bombFrag;

    }

    refreshBomb() {
        let translate = '';
        let scale = '';

        if (this.state.location) {
            translate = `translate(${this.state.location.x}px, ${this.state.location.y}px)`;
        }

        if (this.state.scale) {
            scale = `scale(${this.state.scale})`;
        }

        if (this.state.scale || this.state.location) {
            let transform = `${translate} ${scale}`;
            logger.debug('transform is', transform);
            this.getBomb().style.transform = transform;
        }

        this.state.rafCall = window.requestAnimationFrame(this.refreshBomb.bind(this));
    }

    static getBomb(bombFrag) {
        let bombEl = bombFrag.querySelector('div.bomb-container');
        return bombEl;
    }

    getBomb() {
        return this.state.bomb;
    }

    handleMouseMove(event) {
        if (this.getBomb().style.position != 'absolute') {
            let bombEl = this.getBomb();
            bombEl.style.position = 'absolute';
            bombEl.style.top = 0;
            bombEl.style.left = 0;
        }

        let posOffset = this.settings.size / 2;
        this.state.location = {};
        this.state.location.x = event.pageX - posOffset;
        this.state.location.y = event.pageY - posOffset;
    }

    handleMouseScroll(event) {
        event.preventDefault();
        this.state.scale += 0.01 * event.deltaY;
        if (this.state.scale > 10) this.state.scale = 10;
        if (this.state.scale < 0.5) this.state.scale = 0.5;
        logger.debug('size is now', this.state.scale);
    }

    dropBomb(event) {
        console.log("dropBomb clicked");
        // you can only drop one bomb
        window.removeEventListener('click', this.listeners.handleClick);
        // stop moving the bomb
        window.removeEventListener('mousemove', this.listeners.handleMouseMove);
        window.removeEventListener('wheel', this.listeners.handleMouseScroll);
        // stop raf loop
        window.cancelAnimationFrame(this.state.rafCall);

        this.activateBomb();
    }

    activateBomb(event) {
        setTimeout(this.blowUp.bind(this), BLOW_UP_TIME);

        this.getBomb().classList.add('activated');
        this.getBomb().classList.remove('dropped');

        let validElements = this.determineElements();
        this.explodableElemets = validElements.map(
            e => new ExplodableElement(e, this, this.settings.additive));
    }

    determineElements() {
        let root = document.body;
        let elements = this._determineElements(root);
        logger.debug('Found matching elements:', elements.length);
        return elements;
    }

    _determineElements(element) {
        let children = Array.from(element.children);
        let els = [];

        for (let child of children) {
            if (!child.clientWidth || !child.clientHeight) {
                continue;
            }

            if (child.clientWidth < MIN_SIZE && child.clientHeight < MIN_SIZE) {
                continue;
            }

            if (child.classList.contains('bomb-container')) {
                continue;
            }

            els = els.concat(this._determineElements(child));
        }

        // do we want to add this element as well?
        if (els.length === 0) {
            els.push(element);
        }

        return els;
    }

    getBombLocation() {
        let bombEl = this.getBomb();
        let bounds = bombEl.getBoundingClientRect();
        let location = {
            x: (bounds.left + bounds.right) / 2,
            y: (bounds.top + bounds.bottom) / 2,
        };

        return location;
    }

    blowUp() {
        this.explodableElemets.forEach(e => e.explode());
        this.getBomb().classList.remove('activated');
        this.getBomb().classList.add('exploded');
    }
}
