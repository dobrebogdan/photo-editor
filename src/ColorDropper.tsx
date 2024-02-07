import React, { useEffect, useState } from 'react';
import backgroundImage from './background.png';
import colorPicker from './IconColorPicker.svg';


const ColorDropper: React.FC = () => {
  const [pickedColor, setPickedColor] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [isColorDropperActive, setIsColorDropperActive] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setTextPosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  const fps = 300, fpsInterval = 1000 / fps;
  let context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, then: number, point: { x: any; y: any; }, distPoint: { x: any; y: any; }, pos: { x: any; y: any; }, image: HTMLImageElement;
  const onMouseMove1 = (ev: any) => {
    var rect = canvas.getBoundingClientRect();
    point = {
        x: (ev.clientX - 7) - rect.left,
        y: (ev.clientY - 7) - rect.top
    };

    distPoint = {
        x: (point.x - canvas.width * 0.5) / canvas.width,
        y: (point.y - canvas.height * 0.5) / canvas.height
    };
  }

  const onTouchMove = (ev: any) => {
    var rect = canvas.getBoundingClientRect();
    point = {
        x: ev.touches[0].clientX - rect.left,
        y: ev.touches[0].clientY - rect.top
    };

    distPoint = {
        x: (point.x - canvas.width * 0.5) / canvas.width,
        y: (point.y - canvas.height * 0.5) / canvas.height
    };
  }

  const clear = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
 
  const resize = () => {
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerWidth * 0.7 / 1.77;

  }
  const bind = () => {
    window.addEventListener("resize", resize.bind(this), false);

    canvas.addEventListener("mousemove", onMouseMove1);

    canvas.addEventListener("touchmove", onTouchMove);

  }

  const render = () => {
    clear();
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (isColorDropperActive) {

        pos.x += (point.x - pos.x) * 0.5;
        pos.y += (point.y - pos.y) * 0.5;

        context.save();
        context.beginPath();
        context.arc(pos.x, pos.y, canvas.height * 0.15, 0, Math.PI * 2, true);
        context.strokeStyle = "white";
        context.lineWidth = 6;
        context.stroke();
        context.closePath();
        context.clip();


        context.drawImage(
            image,
            -canvas.width * 0.5 + (canvas.width - canvas.width * 2) * (distPoint.x * 1),
            -canvas.height * 0.5 + (canvas.height - canvas.height * 2) * (distPoint.y * 1),
            canvas.width * 2,
            canvas.height * 2
        );

        context.restore();
    }
  }

  const loop = () => {
    window.requestAnimationFrame(loop.bind(this));

    const now = Date.now();
    const delta = now - then;

    if (delta > fpsInterval) {
        render();
        then = now;
    }
  }


  const initializeCanvas = (currentCanvas: HTMLCanvasElement) => {
      canvas = currentCanvas;
      context = canvas.getContext("2d") as CanvasRenderingContext2D;

      then = Date.now();

      point = { x: 0, y: 0 };
      distPoint = { x: 0, y: 0 };
      pos = { x: 0, y: 0 };

      resize();
      bind();

      image = new Image();
      image.src = backgroundImage;

      image.onload = () => {
          loop();
      };

  }
  useEffect(() => {
    if (isColorDropperActive) {
        const currentCanvas = document.getElementById("magnifyingCanvas");
        initializeCanvas(currentCanvas as HTMLCanvasElement);
    } else {
        const currentCanvas = document.getElementById("regularCanvas");
        initializeCanvas(currentCanvas as HTMLCanvasElement);
    }
  // eslint-disable-next-line
  }, [isColorDropperActive]);

  function rgbToHex(rgbString: string) {
    // Check if the input is in the correct format (e.g., 'rgb(255, 0, 0)')
    const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
      throw new Error('Invalid RGB string format');
    }
  
    // Extract the RGB values from the match
    const [, red, green, blue] = match.map(Number);
  
    // Convert each component to a two-digit hexadecimal value
    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');
  
    // Combine the hexadecimal values to form the final color
    const hexColor = `#${redHex}${greenHex}${blueHex}`;
  
    return hexColor;
  }

  const onCanvasClick = (event: any) => {
    const canvas = document.getElementById("magnifyingCanvas") as HTMLCanvasElement;
    const context = canvas!.getContext("2d");
    var mouseX = event.clientX - canvas!.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas!.getBoundingClientRect().top;

    // Get pixel data at the mouse coordinates
    var imageData = context!.getImageData(mouseX, mouseY, 1, 1);
    var pixel = imageData.data;

    // Extract RGB values
    var red = pixel[0];
    var green = pixel[1];
    var blue = pixel[2];

    setPickedColor(rgbToHex("rgb(" + red + ", " + green + ", " + blue + ")"));
  }

  const onMouseMove = (event: any) => {
    const canvas = document.getElementById("magnifyingCanvas") as HTMLCanvasElement;
    const context = canvas!.getContext("2d");
    var mouseX = event.clientX - canvas!.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas!.getBoundingClientRect().top;

    // Get pixel data at the mouse coordinates
    var imageData = context!.getImageData(mouseX, mouseY, 1, 1);
    var pixel = imageData.data;

    // Extract RGB values
    var red = pixel[0];
    var green = pixel[1];
    var blue = pixel[2];

    setCurrentColor(rgbToHex("rgb(" + red + ", " + green + ", " + blue + ")"));
  }


  return (
    <div>
      <div style={{ position: 'fixed', top: textPosition.y, left: textPosition.x-30, pointerEvents: 'none' }}>
        <p>{isColorDropperActive ? currentColor : ''}</p>
      </div>
      <div style={ 
        {
          width: '4000px',
          height: '16px',
          fontSize: '16px'
        }
      }>
        <img alt="" src={colorPicker} onClick={() => {setIsColorDropperActive(!isColorDropperActive);}}/>
      </div>
      {pickedColor ? <div style={ 
        {
          width: '4000px',
          height: '16px',
          fontSize: '16px'
        }
      }>Picked Color: {pickedColor}</div> : ''}
      {isColorDropperActive ? <canvas id="magnifyingCanvas" width={4000} height={4000} onClick={onCanvasClick} onMouseMove={onMouseMove}/> : <canvas id="regularCanvas" width={4000} height={4000}/>}         
    </div>
  );
};

export default ColorDropper;
