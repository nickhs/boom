import {Bomb} from '../boom/bomb.js';

const EMOJI_COUNT = 60; // num of emojis on the server

// keep in sync with demo.css #emoji-box .emoji
const EMOJI_SIZE = 40; // size of emojis (to make sense of how many to draw)

class EmojiBox {
    constructor(el) {
        if (!el)
            throw 'You need to specify an element (el)';

        this.el = el;

        // create the image handles;
        this.makeImages();

        // remove the loading crap
        this.el.classList.remove('loading');

        this.el.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseMove(event) {
        let emoji = Math.round((Math.random() * EMOJI_COUNT));
        this.images.forEach((img) => {
            img.src = `/emoji_icons/${emoji}.svg`;
        });
    }

    makeImages() {
        this.el.innerHTML = '';

        let images = [];
        let boundingRect = this.el.getBoundingClientRect();
        let emoji_count = (boundingRect.width * boundingRect.height) / Math.pow(EMOJI_SIZE, 2);

        for (let i = 0; i < emoji_count; i++) {
            let img = new Image();
            img.src = `/emoji_icons/0.svg`;
            img.className = 'emoji';
            images.push(img);
        }

        this.images = images;

        // add the images to the emoji box
        this.images.forEach((img) => {
            this.el.appendChild(img);
        });
    }
}

class Tempter {
    constructor(parentEl) {
        if (!parentEl) throw 'You need to speciy an element (parentEl)';
        this.parentEl = parentEl;

        this.el = document.createElement('div');
        this.el.className = 'tempter';
        this.el.innerText = 'Go on. Try it.';

        this.parentEl.appendChild(this.el);
    }
}

class BombContainer {
    constructor(el) {
        if (!el) throw 'You need to speciy an element (el)';
        this.el = el;
        this.listeners = {};

        let bombHolder = document.createElement('div');
        bombHolder.className = 'bomb-holder';

        this.templateBomb = new Bomb({
            inert: true,
        });

        let bombFrag = this.templateBomb.createBomb();
        bombHolder.appendChild(bombFrag);
        this.el.appendChild(bombHolder);
        this.listeners.handleBombPickup = this.handleBombPickup.bind(this);
        this.templateBomb.getBomb().addEventListener('click', this.listeners.handleBombPickup);

        new Tempter(this.el);
    }

    handleBombPickup() {
        let bomb = new Bomb({inert: false});
        document.body.appendChild(bomb.createBomb());
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    new BombContainer(document.querySelector('#bomb-layout'));
    let el = document.querySelector('#emoji-box');
    let emojiBox = new EmojiBox(el);
    window.addEventListener('resize', emojiBox.makeImages);
});
