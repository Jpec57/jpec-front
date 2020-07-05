import React, {useCallback, useEffect, useRef, useState} from 'react';
import './HomePage.scss';
import * as tf from '@tensorflow/tfjs';
import {makePostFormRequest} from "../../utils/rest";
type Coordinate = {
    x: number;
    y: number;
};

const FirstPage: React.FC = () => {
    const CANVAS_SIZE = [300, 300];
    const IMG_SIZE = 60;
    const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';

    const [hirCate, setHirCate] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [showHirInput, setShowHirInput] = useState(0);
    const [model, setModel] = useState();
    const [drawnNumber, setDrawnNumber] = useState(-1);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);


    useEffect(()=>{
        //todo
        const url = new URL('http://localhost:3001/.well-known/mercure');
        url.searchParams.append('topic', 'https://expelliar.jpec.be/challenge/token1234');
        const eventSource = new EventSource(url.toString());
        eventSource.onmessage = event => {
            console.log(JSON.parse(event.data));
        }
        //end
    }, [])


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
        if (!canvasRef.current) {
            return;
        }
        setDrawnNumber(-1);
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
        }
    };

    // Tensorflow
    useEffect(() => {
        const loadModel = async () => {
            const modelVariable = await tf.loadLayersModel("./tensorflow/all_hir_10e_3_3_b_with_batch/model.json");
            setModel(modelVariable);
            setIsLoaded(true);
        };
        loadModel();
    }, []);

    const preprocessCanvas = (image: HTMLCanvasElement) => {
        return tf.browser.fromPixels(image)
            .resizeNearestNeighbor([IMG_SIZE, IMG_SIZE])
            .mean(2)
            .expandDims(2)
            .expandDims()
            .toFloat();
    };

    const predictAndDisplayResult = async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const tensor = preprocessCanvas(canvas);
        const predictions = await model.predict(tensor).data();
        const results = Array.from(predictions);
        console.log(results);
        if (results) {
            displayResults(results);
        }
    };

    const displayResults = (results: any) => {
        let predictedValue = 0;
        let bestPercent = 0;
        results.forEach((value: any, key: any) => {
            if (value > bestPercent) {
                predictedValue = key;
                bestPercent = value;
            }
        });
        setDrawnNumber(predictedValue);
    };


    const getCharacter = (): string => {
        return hiragana[drawnNumber];
    };


    const sendHiraganaToServer = ({isHelping = false, type = null}: {type?: string | null, isHelping?: boolean}) =>{
        const canvas = canvasRef.current;
        if (!canvas){
            return;
        }
        canvas.toBlob((blob)=>{
            if (!blob){
                return;
            }
            type = (!type) ? hirCate : type;
            const file = new File([blob], "hir.png");
            let form = new FormData();
            form.append("type", type);
            form.append("file", file, 'hir.png');
            makePostFormRequest('hiragana', form).then((res) => {
                console.log(res);
            }, (err)=> {
                console.log(err);
            }).then(()=> {
                setShowHirInput(2);
            });
        }, 'image/png', 0.95);
    };


    const showButtonsOrInput = () => {
        if (showHirInput === 1) {
            return (
                <div className="flex-vertical mt-20 hir-buttons">

                    Please copy/paste drawn hiragana from the possible values
                    <input onChange={e => setHirCate(e.target.value)}/>
                    <button className="mt-10" onClick={()=> {
                        if (hirCate.length <= 0){
                            return;
                        }
                        sendHiraganaToServer({isHelping: true});
                    }}>
                        Send correct category
                    </button>
                </div>
            );
        }
        if (showHirInput === 2){
            return (
                <div className="flex-vertical mt-20 hir-buttons">
                    Thank you️️ for your feedback ❤️
                </div>
            );
        }
        return (<div className="flex-vertical mt-20 hir-buttons">
            <div className="flex-horizontal">
                <button className="mr-20 correct-button" onClick={()=> {
                    sendHiraganaToServer({type: getCharacter()})}}>
                    Correct ? :D
                </button>
                <button className="incorrect-button" onClick={()=> {
                    setShowHirInput(1);
                }}>
                    No, dumbass
                </button>
            </div>
            <button className="mt-10" onClick={()=>{
                setShowHirInput(2);
            }}>
                My bad, fam I draw a potato :'(
            </button>
        </div>);
    };

    const renderResult = () => {
        if (drawnNumber >= 0) {
            return (
                <div className="result-div flex-vertical">
                    <p className="mt-20 mb-20">
                        You draw a {getCharacter()} !
                    </p>


                    {showButtonsOrInput()}

                </div>);
        }
        return null;
    };


    const renderLoadingOrButtons = () => {
        if (!isLoaded) {
            return (<p>Loading...</p>);
        }
        return (<div className="flex-horizontal" style={{width: CANVAS_SIZE[0]}}>
            <button id="clear-button" className="btn btn-dark" onClick={() => {
                setShowHirInput(0);
                clearCanvas();
            }}>Clear
            </button>
            <button id="predict-button" className="btn btn-dark" onClick={async () => {
                await predictAndDisplayResult();
            }}>Predict
            </button>
        </div>);
    };

    return (
        <div className="container home-page">
            <div>
                <div className="flex-horizontal">
                    <div className="canvas-div">
                        <canvas width={CANVAS_SIZE[0]} height={CANVAS_SIZE[1]} ref={canvasRef}/>
                    </div>
                    {renderResult()}
                </div>

                {renderLoadingOrButtons()}
            </div>
            <div className="mt-20">
                <p>
                    Possible values are the following: {hiragana}
                </p>
            </div>
        </div>
    );
};

export default FirstPage;
