import {Bomb} from '../boom/bomb.js';

const EMOJI_COUNT = 60; // num of emojis on the server

// keep in sync with demo.css #emoji-box .emoji
const MIN_EMOJI_SIZE = 40; // size of emojis (to make sense of how many to draw)
const MAX_EMOJI_RENDERED = 300;

class EmojiBox {
    constructor(el) {
        if (!el)
            throw 'You need to specify an element (el)';

        this.el = el;
        this.emoji = 0;

        // create the image handles;
        this.makeImages();

        // remove the loading crap
        this.el.classList.remove('loading');

        this.el.addEventListener('mousemove', this.handleMouseMove.bind(this));

        window.requestAnimationFrame(this.refresh.bind(this));

    }

    handleMouseMove(event) {
        let emoji = Math.round((Math.random() * EMOJI_COUNT));
        this.emoji = emoji;
    }

    refresh() {
        if (!this.images[0].src.includes(`/${this.emoji}.svg`)) {
            this.images.forEach((img) => {
                img.src = `/emoji_icons/${this.emoji}.svg`;
            });
        }

        window.requestAnimationFrame(this.refresh.bind(this));
    }

    makeImages() {
        this.el.innerHTML = '';

        let images = [];
        let boundingRect = this.el.getBoundingClientRect();

        // work out how big to make our emojis
        let desired_emoji_size = Math.sqrt((boundingRect.width * boundingRect.height) / MAX_EMOJI_RENDERED);
        desired_emoji_size = Math.ceil(desired_emoji_size);

        if (desired_emoji_size < MIN_EMOJI_SIZE) {
            desired_emoji_size = MIN_EMOJI_SIZE;
        }

        desired_emoji_size += 5; // add in padding

        // now that we've determined the size figure out how many emojis we need
        let emoji_row_count = Math.floor(boundingRect.width / desired_emoji_size);
        let emoji_col_count = Math.floor(boundingRect.height / desired_emoji_size);
        let emoji_count = emoji_col_count * emoji_row_count;

        for (let i = 0; i < emoji_count; i++) {
            let img = new Image();
            img.src = `/emoji_icons/${this.emoji}.svg`;
            img.height = desired_emoji_size;
            img.width = desired_emoji_size;
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
        this.el.textContent = 'Go on. Click me.';
        this.parentEl.appendChild(this.el);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.el.textContent = 'Click to release. Scroll to size.';
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
        let bombFragEl = this.bombFragEl = bombHolder.querySelector('div');
        bombFragEl.classList.add('jump');
        this.el.appendChild(bombHolder);
        this.listeners.handleBombPickup = this.handleBombPickup.bind(this);
        this.templateBomb.getBomb().addEventListener('click', this.listeners.handleBombPickup);

        this.tempter = new Tempter(this.el);
    }

    handleBombPickup() {
        this.bombFragEl.classList.remove('jump');
        this.listeners.handleBombDrop = this.handleBombDrop.bind(this);

        let bomb = new Bomb({inert: false});
        document.body.appendChild(bomb.createBomb());
        this.tempter.onClick();

        setTimeout(() =>
            window.addEventListener('click', this.listeners.handleBombDrop),
            50);
    }

    handleBombDrop() {
        window.removeEventListener('click', this.listeners.handleBombDrop);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    new BombContainer(document.querySelector('#bomb-layout'));
    let el = document.querySelector('#emoji-box');
    let emojiBox = new EmojiBox(el);
    window.addEventListener('resize', emojiBox.makeImages);
});
