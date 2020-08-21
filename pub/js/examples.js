Seui('#ex1Rat', '#ex1Main', [
  {
    direction: "counter-clockwise",
    end: {x: '43', y: '100'}, // not being used currently
  },
  {
    direction: 'clockwise',
    end: {x: '873', y: '100'}, // not being used currently
    // will add other animation options
  },

]);

document.querySelector('#changeDimForm').addEventListener('submit', event => changeDim(event));

Seui('#ex2Rat', '#ex2Main', [
  {
    direction: 'clockwise',
    end: {x: '873', y: '100'}, // not being used currently
    // will add other animation options
  },
]);

function changeDim(event) {
  event.preventDefault();

  const main = document.querySelector('#ex2Main');
  const newWidth = document.querySelector('#widthInput').value;
  const newHeight = document.querySelector('#heightInput').value;

  if (newWidth.length >= 1) main.setAttribute('width', newWidth);
  if (newHeight.length >= 1) main.setAttribute('height', newHeight);

  Seui('#ex2Rat', '#ex2Main', [
    {
      direction: 'clockwise',
      end: {x: '873', y: '100'}, // not being used currently
      // will add other animation options
    },
  ]);
}
