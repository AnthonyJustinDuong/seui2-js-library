'use strict';

const seui2AnimateMotionId = 'seui2AnimateMotion';
const seui2AnimateTransformId = 'seui2AnimateTransform';

function Seui(toAnimate, toAvoid, animationsSpecs) {
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

  // let otherStart = null;
  // for (let i = 0; i < animDetails.length; i++){
  //   if (i > 0) otherStart = animDetails[i - 1].end;
  //   const {end, direction} = animDetails[i];
  //   const animMotionNode = createMotionAnimation(_self.animateId,
  //     _self.avoidId, otherStart, end, direction);
  //
  //   _self.animations.push(animMotionNode);
  // }

  // console.log('anim 0', _self.animations[0]);
  // _self.toAnimateNode.appendChild(_self.animations[0]);
  // _self.animations[0].addEventListener('endEvent', appendNextAnimation(_self))
  // _self.animations[0].setAttribute("onend", 'appendNextAnimation()')

  const animateMotion = createMotionAnimation(_self.animateId,
       _self.avoidId, animationsSpecs[0]);
  _self.toAnimateNode.appendChild(animateMotion);
  _self.updateAnimation = function () {};

  animateMotion.addEventListener('beginEvent', () => setOrigin(_self.toAnimateNode));
  return _self;
}

function createMotionAnimation(animateId, avoidId, animationSpecs) {
  const {start, end, direction} = animationSpecs;
  let path;
  if (avoidId !== null) {
    const toAnimate = document.querySelector(animateId);
    // if (avoidId !== null) {
    //   toAnimate.setAttribute('x', '43');
    //   toAnimate.setAttribute('y', '100');
    // } else {
    //   toAnimate.setAttribute('x', '873');
    //   toAnimate.setAttribute('y', '100');
    // }


    let {x: {animVal: {value: anX}}, y: {animVal: {value: anY}},
      width: {animVal: {value: anW}}, height: {animVal: {value: anH}}} = toAnimate;

    const toAvoid = document.querySelector(avoidId);
    const {x: {animVal: {value: avX}}, y: {animVal: {value: avY}},
      width: {animVal: {value: avW}}, height: {animVal: {value: avH}}} = toAvoid;

    const toAnimateDim = {width: anW, height: anH};
    const toAvoidDim = {x: avX, y: avY, width: avW, height: avH};
    path = generatePath(toAnimateDim, toAvoidDim, animationSpecs);
  } else {
    path = 'm 0 0 h 500z';
  }

  // console.log(path);

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
  // animMotion.setAttribute('rotate', 'auto-reverse');
  // animMotion.beginElement();

  // console.log('anim generated', animMotion);
  return animMotion;
}

function generatePath(toAnimateDim, toAvoidDim, animationSpecs) {
  const {width: anW, height: anH} = toAnimateDim;
  const {x: avX, y: avY, width: avW, height: avH} = toAvoidDim;
  const {start, end, direction, padding, paddingLeft, paddingTop, paddingRight,
    paddingBottom} = animationSpecs;

  const p0 = padding ? padding : 0;
  const pl = paddingLeft ? paddingLeft : p0;
  const pt = paddingTop ? paddingTop : p0;
  const pr = paddingRight ? paddingRight : p0;
  const pb = paddingBottom ? paddingBottom : p0;

  const pads = {pl, pt, pr, pb};
  const corners = getCorners(direction, toAnimateDim, toAvoidDim, pads);
  // evacuate points
  // console.log(corners);
  let startQuad = getQuadrant(start, direction, toAnimateDim, toAvoidDim, pads);
  const endQuad = getQuadrant(end, direction, toAnimateDim, toAvoidDim, pads);

  if (startQuad < 0) {
    console.error(`Seui2: The start point: (${start.x}, ${start.y}) provided is invalid.`);
    return 'm 0 0';
  }
  if (endQuad < 0) {
    console.error(`Seui2: The end point: (${end.x}, ${end.y}) provided is invalid.`);
    return 'm 0 0';
  }

  console.log(start, end, startQuad, endQuad);

  let path = `m ${start.x} ${start.y} `;
  if (direction.localeCompare('clockwise') == 0) {

    // Easy path, if same quadrant
    if (startQuad === endQuad) {
      const possiblePath = sameQuadPath(startQuad, 'clockwise', start, end);
      if (possiblePath) return possiblePath;
    }

    // Start with a path to the first corner
    if (startQuad % 2 === 0) {
      // top or bottom quadrant
      path += `q ${corners[startQuad].x - start.x} 0\
        ${corners[startQuad].x - start.x} ${corners[startQuad].y - start.y} `;
    } else {
      // left or right quadrant
      path += `q 0 ${corners[startQuad].y - start.y}\
        ${corners[startQuad].x - start.x} ${corners[startQuad].y - start.y} `;
    }
    startQuad = (startQuad + 1) % 4;

    // Go around the shape to avoid
    while (startQuad !== endQuad) {
      switch (startQuad) {
        case 0:
          path += `h ${corners[0].x - corners[3].x} `;
          break;
        case 1:
          path += `v ${corners[1].y - corners[0].y} `;
          break;
        case 2:
          path += `h ${corners[2].x - corners[1].x} `;
          break;
        case 3:
          path += `v ${corners[3].y - corners[2].y} `;
          break;
        default:
          break;
      }
      startQuad = (startQuad + 1) % 4;
    }

    // End with path to end point
    const cornerBefore = corners[(endQuad + 3) % 4];
    if (endQuad % 2 === 0) {
      // top or bottom quadrant
      path += `q 0 ${end.y - cornerBefore.y}\
        ${end.x - cornerBefore.x} ${end.y - cornerBefore.y}`;
    } else {
      // left or right quadrant
      path += `q ${end.x - cornerBefore.x} 0\
        ${end.x - cornerBefore.x} ${end.y - cornerBefore.y}`;
    }

    // path = ` v ${avY + avH - anY} q 0 ${padding} ${avX - anX} ${padding}
    // h ${avW} q ${padding} 0 ${padding} ${-padding} v ${anY - avY - avH}`;
  }

  else
    path = path + ` m 0 0 v ${avY + avH - anY} q 0 ${padding} ${avX + avW - anX} ${padding}
    h ${-avW - anW} q ${-padding} 0 ${-padding} ${-padding} v ${anY - avY - avH}`

  return path;
}

function getQuadrant(point, direction, toAnimateDim, toAvoidDim, pads) {
  const {x, y} = point;
  const {width: anW, height: anH} = toAnimateDim;
  const {x: avX, y: avY, width: avW, height: avH} = toAvoidDim;
  const {pl, pt, pr, pb} = pads;

  /*
    counter clockwise

  */
  // Return the quadrant the point is in relative
  // to the avoid dimensions and padding
  // console.log('direction', direction);
  if (direction.localeCompare('clockwise') == 0) {
    // console.log('in clockwise');
    /*
      clockwise
      ___0_|
      3|___|__1
       | 2
    */
    if (x <= avX + avW + pr && y <= avY - anH - pt) {
      return 0;
    } else if (x >= avX + avW + pr && y <= avY + avH + pb){
      return 1;
    } else if (x >= avX - anW - pl && y >= avY + avH + pb) {
      return 2;
    } else if (x <= avX - anW - pl && y >= avY - anH - pt) {
      return 3;
    }
  }

  return -1;
}

function getCorners(direction, toAnimateDim, toAvoidDim, pads) {
  const {width: anW, height: anH} = toAnimateDim;
  const {x: avX, y: avY, width: avW, height: avH} = toAvoidDim;
  const {pl, pt, pr, pb} = pads;

  // if (direction === 'clockwise') {
    return [{x: avX + avW + pr, y: avY - anH - pt},
      {x: avX + avW + pr, y: avY + avH + pb},
      {x: avX - anW - pl, y: avY + avH + pb},
      {x: avX - anW - pl, y: avY - anH - pt}];

  // }
}

function sameQuadPath(quad, direction, start, end) {
  switch (quad) {
    case 0:
      if (start.x <= end.x) {
        if (start.y <= end.y) {
          return `m ${start.x} ${start.y} q ${end.x - start.x} 0
          ${end.x - start.x} ${end.y - start.y}`;
        } else {
          return `m ${start.x} ${start.y} q 0 ${end.y - start.y}
          ${end.x - start.x} ${end.y - start.y}`;
        }
      }
      break;
    case 1:
      if (start.y <= end.y) {
        if (start.x <= end.x) {
          return `m ${start.x} ${start.y} q ${end.x - start.x} 0
          ${end.x - start.x} ${end.y - start.y}`;
        } else {
          return `m ${start.x} ${start.y} q 0 ${end.y - start.y}
          ${end.x - start.x} ${end.y - start.y}`;
        }
      }
      break;
    case 2:
      if (start.x >= end.x) {
        if (start.y >= end.y) {
          return `m ${start.x} ${start.y} q ${end.x - start.x} 0
          ${end.x - start.x} ${end.y - start.y}`;
        } else {
          return `m ${start.x} ${start.y} q 0 ${end.y - start.y}
          ${end.x - start.x} ${end.y - start.y}`;
        }
      }
      break;
    case 3:
      if (start.y >= end.y) {
        if (start.x >= end.x) {
          return `m ${start.x} ${start.y} q ${end.x - start.x} 0
          ${end.x - start.x} ${end.y - start.y}`;
        } else {
          return `m ${start.x} ${start.y} q 0 ${end.y - start.y}
          ${end.x - start.x} ${end.y - start.y}`;
        }
      }
      break;
    default:
      break;
  }

  return null;
}

function setOrigin(toAnimateNode) {
  toAnimateNode.setAttribute('x', 0);
  toAnimateNode.setAttribute('y', 0);
}

function appendNextAnimation(_self) {
  console.log("append next animation");
  // const {toAnimateNode, animations} = _self;
  // _self.animationCounter += 1;
  // toAnimateNode.appendChild(animations[_self.animationCounter]);
  // animations[_self.animationCounter].addEventListener('endEvent', appendNextAnimation(_self))
}
