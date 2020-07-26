'use strict';

const seui2AnimateMotionId = 'seui2AnimateMotion';
const seui2AnimateTransformId = 'seui2AnimateTransform';

function Seui(toAnimate, toAvoid, animOptions) {
  const _self = {};

  _self.animateId = null;
  if (typeof(toAnimate) === 'string') {
    _self.animateId = toAnimate;
  }

  if (typeof(toAvoid) === 'string') {
    _self.avoidId = toAvoid;
  } else {
    _self.avoidId = null;
  }

  _self.animations = [];
  _self.animationCounter = 0;

  _self.toAnimateNode = document.querySelector(_self.animateId);

  // nodelist not an array
  // remove other animate Motions
  // const allAnimateMotions = _self.toAnimateNode.querySelectorAll('animateMotion');
  // let _animMotion = null;
  // for (let i = 0; i < allAnimateMotions.length; i++) {
  //   if (allAnimateMotions.item(i).id === seui2AnimateMotionId) {
  //     if (false/*_animMotion == null*/) _animMotion = allAnimateMotions.item(i);
  //     else allAnimateMotions.item(i).remove();
  //   }
  // }

  // if (_animMotion === null) {
  //   _animMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
  //   _animMotion.setAttribute('id', seui2AnimateMotionId);
  //   _self.toAnimateNode.appendChild(_animMotion);
  // }

  let otherStart = null;
  for (let i = 0; i < animOptions.length; i++){
    if (i > 0) otherStart = animOptions[i - 1].end;
    const {end, direction} = animOptions[i];
    const animMotionNode = createMotionAnimation(_self.animateId,
      _self.avoidId, otherStart, end, direction);

    _self.animations.push(animMotionNode);
  }

  console.log('anim 0', _self.animations[0]);
  _self.toAnimateNode.appendChild(_self.animations[0]);
  // _self.animations[0].addEventListener('endEvent', appendNextAnimation(_self))
  _self.animations[0].setAttribute("onend", 'appendNextAnimation()')
  return _self;
}

function createMotionAnimation(animateId, avoidId, start, end, direction) {

  let path;
  if (avoidId !== null) {
    path = generatePath(animateId, avoidId, start, end, direction);
  } else {
    path = 'm 0 0 h 500z';
  }

  console.log(path);

  // let animMotion = toAnimate.querySelector(`#${seui2AnimateMotionId}`);
  // animMotion = animMotion[animMotion.length - 1];
  // animMotion.remove();
  let animMotion = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
  // toAnimate.appendChild(animMotion);
  // animMotion.outerHTML = '<animateMotion></animateMotion>';
  // console.log(animMotion);
  animMotion.setAttribute('id', seui2AnimateMotionId);
  animMotion.setAttribute('href', animateId);
  animMotion.setAttribute('path', path);
  animMotion.setAttribute('dur', '2s')
  animMotion.setAttribute('repeatCount', '1');
  animMotion.setAttribute('begin', 'click');
  animMotion.setAttribute('fill', 'freeze');
  // animMotion.beginElement();

  // console.log('anim generated', animMotion);
  return animMotion;
}

function generatePath(animateId, avoidId, start, end, direction) {
  const toAnimate = document.querySelector(animateId);
  // if (avoidId !== null) {
  //   toAnimate.setAttribute('x', '43');
  //   toAnimate.setAttribute('y', '100');
  // } else {
  //   toAnimate.setAttribute('x', '873');
  //   toAnimate.setAttribute('y', '100');
  // }


  const {x: {animVal: {value: anX}}, y: {animVal: {value: anY}},
    width: {animVal: {value: anW}}, height: {animVal: {value: anH}}} = toAnimate;

  const toAvoid = document.querySelector(avoidId);
  const {x: {animVal: {value: avX}}, y: {animVal: {value: avY}},
    width: {animVal: {value: avW}}, height: {animVal: {value: avH}}} = toAvoid;

  const padding = 20;
  console.log(anX, anY, anW, anH);
  console.log(avX, avY, avW, avH);

  let path = '';
  if (start !== null) {
    path = `m ${start.x - anX} ${start.y - anY}`;
  }
  if (direction === "clockwise")
    path = path + ` m 0 0 v ${avY + avH - anY} q 0 ${padding} ${avX - anX} ${padding}
    h ${avW} q ${padding} 0 ${padding} ${-padding} v ${anY - avY - avH}`;
  else
    path = path + ` m 0 0 v ${avY + avH - anY} q 0 ${padding} ${avX + avW - anX} ${padding}
    h ${-avW - anW} q ${-padding} 0 ${-padding} ${-padding} v ${anY - avY - avH}`

  return path;
}

function appendNextAnimation(_self) {
  console.log("append next animation");
  // const {toAnimateNode, animations} = _self;
  // _self.animationCounter += 1;
  // toAnimateNode.appendChild(animations[_self.animationCounter]);
  // animations[_self.animationCounter].addEventListener('endEvent', appendNextAnimation(_self))
}
