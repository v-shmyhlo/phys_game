const { Observable: Obs } = require('rx');
const _ = require('lodash');
const $ = require('jquery');

const _keydownStream = () => Obs.fromEvent(document, 'keydown');
const _keyupStream = () => Obs.fromEvent(document, 'keyup');

export const interval = Obs.interval;
export const $window = $(window);
export const debug = (es) => es.subscribe((v) => console.log(v));
export const windowEvent = _.curry(Obs.fromEvent, 2)($window);
export const fromEvent = Obs.fromEvent;

export const keydownStream = (keycode) => {
  return _keydownStream()
  .map(e => e.keyCode)
  .filter(k => k == keycode)
}

export const keyupStream = (keycode) => {
  return _keyupStream()
  .map(e => e.keyCode)
  .filter(k => k == keycode)
}

export const scheduledKeyStream = (key, interval) => {
  return Obs
  .merge(keydownStream(key).map(true), keyupStream(key).map(false))
  .distinctUntilChanged()
  .filter(v => v)
  .flatMap(v => Obs.interval(interval).startWith(1).takeUntil(keyupStream(key)));
}