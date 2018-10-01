'use strict';

window.addEventListener('scroll', throttled(30, updateNavOnScroll));

/**
 * apply a class on the navbar, depending on body's scroll position
 * @param e
 */
function updateNavOnScroll(e) {
    let allLinksToNavbar = document.getElementsByClassName("link-to-navbar");
    let lastFoundElement = undefined; // don't toggle the same item over and over again


    // sort in asc order of their scroll (i have the feeling this isn't needed)
    let scroll = window.scrollY;
    allLinksToNavbar = [...allLinksToNavbar].sort((x, y) => {
        let xs = x.getBoundingClientRect().top + scroll;
        let ys = y.getBoundingClientRect().top + scroll;
        return xs - ys;
    });


    let el = choseCurrentElementOnscreen(allLinksToNavbar);
    if (el !== lastFoundElement) {
        lastFoundElement = el;

        // disable old item(s?)
        [...document.getElementsByClassName("current-navbar-item")].forEach(it => it.classList.toggle("current-navbar-item"));

        // enable new item
        findNavLinkFromHref(el).classList.toggle("current-navbar-item");
    }
}

function findNavLinkFromHref(el) {
    return document.querySelector(`[href*='${el.id}']`)
}

/**
 * Try to figure out which of the items is the most "on screen" and return it.
 *
 * First element (I am at the top of the page) is handled by checking the scroll amount of the window,
 * as it is expected that the first element is always selected.
 *
 * Last element (I am at the bottom of the page and i am very tiny) is handled by
 * 1. not quitting if the second-to-last element is good enough
 * 2. testing for the last item if the scroll is actually at the bottom of the page.
 */
function choseCurrentElementOnscreen(elements) {
    let selectedElement;
    for (let i = 0; i < elements.length; i++) {
        let el = elements[i];
        let {top, bottom} = el.getBoundingClientRect();

        // handle "i am at the top" case
        if (window.scrollY < (window.innerHeight * 0.8 / 9)) {
            console.log("top of the page");
            selectedElement = el;
            break;
        }

        /**
         * When the second-to-last element is checked, there may be a case that
         * the last element is so small that it is simply ignored (since this would return true).
         *
         * Therefore this special case is treated as follows:
         * if this is the second-to-last element, don't break the search, because the next element may be onscreen.
         */
        let isSecondToLast = i === elements.length - 2;
        let isLast = i === elements.length - 1;

        let check = top > 0 && top < (window.innerHeight * 4 / 9) && bottom >= 0;   // general case: if ok, break
        if (check) {
            selectedElement = el;
            if (!isSecondToLast) {
                break;
            }
        } else if (isLast) {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - window.innerHeight * 1 / 9) {
                selectedElement = el;
            }
        }
    }
    return selectedElement;
}


/**
 * Throttle a method call for a specific delay.
 *
 * Details here: https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
 *
 * @param delay
 * @param func
 * @returns {function(...[*]): *}
 */
function throttled(delay, func) {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    }
}


/**
 * font selector
 */
document.getElementById("select-font").addEventListener("change", function () {
    for (let el of document.getElementsByClassName("main-select-font")) {
        el.style.fontFamily = this.value;
    }
});
