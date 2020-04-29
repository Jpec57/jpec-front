import React, {useCallback, useEffect, useRef, useState} from 'react';
import './HomePage.scss';
import * as tf from '@tensorflow/tfjs';

type Coordinate = {
    x: number;
    y: number;
};


const FirstPage: React.FC = () => {
    const CANVAS_SIZE = [300, 300];

    const [model, setModel] = useState();
    const [drawnNumber, setDrawnNumber] = useState(-1);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);


    const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const x = event.pageX - canvas.offsetLeft;
        const y = event.pageY - canvas.offsetTop;
        return {x, y};
    };

    //Start painting on mousedown
    const startPaint = useCallback((event: MouseEvent) => {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            setIsPainting(true);
            setMousePosition(coordinates);
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        };
    }, [startPaint]);
    //end

    //Moving for painting
    const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.strokeStyle = "white";
            context.lineJoin = "round";
            context.lineWidth = 10;

            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();
            context.stroke();
        }
    };

    const paint = useCallback((event: MouseEvent) => {
        if (isPainting) {
            const newMousePosition = getCoordinates(event);
            if (mousePosition && newMousePosition) {
                drawLine(mousePosition, newMousePosition);
                setMousePosition(newMousePosition);
            }
        }
    }, [isPainting, mousePosition]);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousemove', paint);
        return () => {
            canvas.removeEventListener('mousemove', paint);
        };
    }, [paint]);
    //end

    //Stop drawing
    const stopDrawing = useCallback(() => {
        setIsPainting(false);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        return () => {
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
        };
    }, [stopDrawing]);
    //end

    const clearCanvas = () => {
      if (!canvasRef.current){
          return;
      }
      setDrawnNumber(-1);
      const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context){
            context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
        }
    };

    // Tensorflow
    useEffect( () => {
        const loadModel = async () => {
            const modelVariable = await tf.loadLayersModel("./tensorflow/models/model.json");
            setModel(modelVariable);
        };
        loadModel();
    }, []);

    const preprocessCanvas = (image: HTMLCanvasElement) => {
        let tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([28, 28])
            .mean(2)
            .expandDims(2)
            .expandDims()
            .toFloat();
        return tensor.div(255.0);
    };

    const predictAndDisplayResult = async () => {
        const canvas = canvasRef.current;
        if (!canvas){
            return;
        }
        const tensor = preprocessCanvas(canvas);
        const predictions = await model.predict(tensor).data();
        const results = Array.from(predictions);
        if (results){
            displayResults(results);
        }
    };

    const displayResults = (results: any) => {
        let predictedValue = 0;
        let bestPercent = 0;
        results.forEach((value: any, key: any) => {
            if (value > bestPercent){
                predictedValue = key;
                bestPercent = value;
            }
        });
        setDrawnNumber(predictedValue);
    };


    const renderResult = () => {
        if (drawnNumber >= 0) {
            return (
                <div className="result-div">
                    You draw a {drawnNumber} !
                </div>);
        }
        return null;
    };


    return (
        <div className="container">
            <header className="header-content"></header>
            <div>
                <span>This is a test</span>
                <div className="flex-horizontal">
                <div className="canvas-div">
                    <canvas width={CANVAS_SIZE[0]} height={CANVAS_SIZE[1]} ref={canvasRef}/>
                </div>
                    {renderResult()}
                </div>

                <button id="clear-button" className="btn btn-dark" onClick={()=>{
                    clearCanvas();
                }}>Clear</button>
                <button id="predict-button" className="btn btn-dark" onClick={async () => {
                    await predictAndDisplayResult();
                }}>Predict
                </button>
            </div>
        </div>
    );
};

export default FirstPage;
