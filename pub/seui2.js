corner'use strict';

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
  // const {width: anW, height: anH} = toAnimateDim;
  const {/*x: avX, y: avY,*/ width: avW, height: avH} = toAvoidDim;
  const {start, end, direction, padding, paddingLeft, paddingTop, paddingRight,
    paddingBottom, bend, rotate} = animationSpecs;

  const p0 = padding ? padding : 0;
  const pl = paddingLeft ? paddingLeft : p0;
  const pt = paddingTop ? paddingTop : p0;
  const pr = paddingRight ? paddingRight : p0;
  const pb = paddingBottom ? paddingBottom : p0;

  const pads = {pl, pt, pr, pb};
  // 'none' is animationSpecs.rotate
  const borders = getBorders(toAnimateDim, toAvoidDim, pads, 'none');

  // evacuate points
  const startOctant = getOctant(start, borders);
  const endOct = getOctant(end, borders);

  const corners = getCorners(borders);

  const ccw = /^\s*(anti|counter)[\s|-]?clockwise\s*$/.test(direction);
  console.log(startOctant, endOct);

  const {incr, cont, edgePath, directPath, sameOctPath} = getCCWExpressions(ccw, bend, borders);

  // Easy path, if same octant and the start point is "before" the end point
  if (startOctant === endOct) {
    const possiblePath = sameOctPath(startOctant % 4, directPath, start, end);
    console.log(possiblePath);
    if (possiblePath) return possiblePath;
  }

  // Easy path, if "direct" path is available
  if (!cont(startOctant % 4, endOct)) {
    return `m ${start.x} ${start.y} ` + directPath(start, end);
  }

  // More complex path
  let path = `m ${start.x} ${start.y} `;
  if (cont(startOctant % 4, endOct)) {  // If end is not "direct"
    // Start with a path to the first corner
    const next = incr(startOctant % 4);
    path += directPath(start, corners[next]);

    // Adds edge paths until end is "in sight" (a "direct" path is available)
    let corner = next;
    while (cont(corner, endOct)) {
      path += edgePath(corner);
      corner = incr(corner);
    }

    // Add last path to end point
    path += directPath(corners[corner], end);
  }

  return path;
}

function getBorders(toAnimateDim, toAvoidDim, pads, rotate) {
  const {width: anW, height: anH} = toAnimateDim;
  const {x: avX, y: avY, width: avW, height: avH} = toAvoidDim;
  const {pl, pt, pr, pb} = pads;

  if (rotate.localeCompare('auto') == 0) {
    const origin = {x: anW, y: anH/2};
    const anPadding = anW / 2;

    return {
      left: avX - pl - anPadding,
      top: avY - pt - anPadding,
      right: avX + avW + pr + anPadding,
      bottom: avY + avH + pb + anPadding
    };
  }

  // origin: (0, 0)
  // anLeftPadding = anW, anTopPadding = anH
  // anRightPadding = 0, anBottomPadding = 0
  return {
    left: avX - pl - anW,
    top: avY - pt - anH,
    right: avX + avW + pr,
    bottom: avY + avH + pb,
  };
}

function getCorners(borders) {
  return [
    {x: borders.left, y: borders.top},
    {x: borders.right, y: borders.top},
    {x: borders.right, y: borders.bottom},
    {x: borders.left, y: borders.bottom},
  ];
}

function getOctant(point, borders) {
  const {x, y} = point;
  console.log(borders);
  /*
  __0__|__4__|__1__
  __7__|_____|__5__
    3  |  6  |  2
  */
  if (x <= borders.left && y <= borders.top) return 0;
  if (x <= borders.right && y <= borders.top) return 4;
  if (/* x > borders.right && */ y <= borders.top) return 1;
  if (x >= borders.right && y <= borders.bottom) return 5;
  if (x >= borders.right && y >= borders.bottom) return 2;
  if (x >= borders.left /* && y >= borders.bottom */) return 6;
  if (x <= borders.left && y >= borders.bottom) return 3;
  // if (x <= borders.left && y <= borders.top)
  return 7;
}

function getCCWExpressions(ccw, bend, borders) {
  return (ccw ?
    {
      incr: oct => (oct + 3) % 4,
      cont: (corner, endOct) => corner !== (endOct - 3) % 4 && (corner + 3) % 4 !== endOct,
      edgePath: corner => {
        const h = borders.bottom - borders.top;
        const w = borders.right - borders.left;
        switch (corner) {
          case 0:
            return `q ${-bend} ${-h/2} 0 ${-h} `;
          case 1:
            return `q ${-w/2} ${-bend} ${-w} 0 `;
          case 2:
            return `q ${bend} ${-h/2} 0 ${-h} `;
          case 3:
            return `q ${w/2} ${bend} ${w} 0 `;
          default:
            return '';
        }
      },
      directPath: (start, end) => {
        if (start.x <= end.x && start.y <= end.y || start.x >= end.x && start.y >= end.y) {
          return `q 0 ${end.y - start.y} ${end.x - start.x} ${end.y - start.y} `;
        }
        return `q ${end.x - start.x} 0 ${end.x - start.x} ${end.y - start.y} `;
      },
      sameOctPath: (octant, directPath, start, end) => {
        const corner = octant >= 4 ? (octant - 3) % 4 : octant;
        if (corner == 0 && start.y <= end.y || corner == 1 && start.x >= end.x
          || corner == 2 && start.y >= end.y || corner == 3 && start.x <= end.x)
          return `m ${start.x} ${start.y} ` + directPath(start, end);
      },
    } :
    {
      incr: oct => (oct + 1) % 4,
      cont: (corner, endOct) => corner + 4 !== endOct && (corner + 1) % 4 !== endOct,
      edgePath: corner => {
        const h = borders.bottom - borders.top;
        const w = borders.right - borders.left;
        switch (corner) {
          case 0:
            return `q ${w/2} ${-bend} ${w} 0 `;
          case 1:
            return `q ${bend} ${h/2} 0 ${h} `;
          case 2:
            return `q ${-w/2} ${bend} ${-w} 0 `;
          case 3:
            return `q ${-bend} ${-h/2} 0 ${-h} `;
          default:
            return '';
        }
      },
      directPath: (start, end) => {
        if (start.x <= end.x && start.y >= end.y || start.x >= end.x && start.y <= end.y) {
          return `q 0 ${end.y - start.y} ${end.x - start.x} ${end.y - start.y} `;
        }
        return `q ${end.x - start.x} 0 ${end.x - start.x} ${end.y - start.y} `;
      },
      sameOctPath: (octant, directPath, start, end) => {
        const corner = octant % 4;
        if (corner == 0 && start.x <= end.x || corner == 1 && start.y <= end.y
          || corner == 2 && start.x >= end.x || corner == 3 && start.y >= end.y)
          return `m ${start.x} ${start.y} ` + directPath(start, end);
      },
    }
  );
}

function setOrigin(toAnimateNode, x, y) {
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
