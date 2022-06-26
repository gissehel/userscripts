// ==UserScript==
// @name         twitch-auto-click
// @namespace    http://github.com/gissehel/userscripts
// @version      1.0.10
// @description  twitch-auto-click
// @author       gissehel
// @homepage     https://github.com/gissehel/userscripts
// @supportURL   https://github.com/gissehel/userscripts/issues
// @match        https://twitch.tv/*
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';
    console.log('twitch-auto-click start')
    let lastBitsZone = null;
    const clickBits = () => {
        const bitsZone = document.querySelectorAll('.community-points-summary')[0];
        if (bitsZone) {
            if (bitsZone !== lastBitsZone) {
                bitsZone.style.backgroundColor = '#ffeecc';
            }
            lastBitsZone = bitsZone
            const button = bitsZone.querySelectorAll('button')[1];
            if (button) {
                button.click();
            }
        }
    };
    setInterval(() => clickBits(), 1000);
    console.log('twitch-auto-click activated')
})()