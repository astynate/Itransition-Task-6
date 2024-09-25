import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createSignalRContext } from "react-signalr/signalr";
import styles from './main.module.css';
import Sheet from '../elements/sheet/Sheet';
import Header from '../widgets/header/Header';
import Slide from '../elements/slide/Slide';
import add from './images/add.svg';
import { observer } from 'mobx-react-lite';
import userState from '../../../state/userState';
import SlideAPI from './api/SlideAPI';

export const signalrContext = createSignalRContext();

const PresentationPage = observer(() => {
    const [presentation, setPresentation] = useState({});
    const [slides, setSlides] = useState([]);
    const [texts, setText] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(-1);
    const [currentTool, setTool] = useState(0);
    let params = useParams();

    signalrContext.useSignalREffect(
        "JoinedPresentation",
        (data) => {
            const { presentation, slides, text } = JSON.parse(data);

            setPresentation(presentation ?? {});
            setSlides(slides ?? []);
            setText(text ?? []);
            setCurrentSlide(slides ? 0 : -1);
        }
    );

    signalrContext.useSignalREffect(
        "DisconnectUser",
        (data) => {
            if (!presentation.connectedUsers || !presentation.connectedUsers.length) {
                return;
            }

            setPresentation(prev => {
                const updatedPresentation = {
                    ...prev,
                    connectedUsers: prev.connectedUsers.filter(e => e.username !== data)
                };
    
                return updatedPresentation;
            });
        }
    );

    signalrContext.useSignalREffect(
        "AddSlide",
        (data) => {
            if (data && data != "null") {
                setSlides(prev => [JSON.parse(data), ...prev]);
            }
        }
    );

    signalrContext.useSignalREffect(
        "DeleteSlide",
        (data) => {
            if (!data) return;

            setSlides(prev => {
                let index = 0;
                let result = prev
                    .filter(e => e.id.toString() !== data.toString())
                    .sort((a, b) => a.index - b.index)
                    .map(element => {
                        element.index = index;
                        index++;
                        return element;
                    });
                
                return result;
            });
        }
    );

    useEffect(() => {
        const joinRoom = async () => {
            try {
                while (signalrContext.connection.state === "Connecting") {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
        
                if (signalrContext.connection.state !== "Connected") {
                    await signalrContext.connection.start();
                }
        
                await signalrContext.invoke("Join", userState.username, params.id);
            } catch (error) {
                console.error("Error joining the room:", error);
            }
        };

        joinRoom();
    }, [params.id]);

    function handleKeyPress(event) {
        if (event.key === 'Delete') {
            setSlides(prev => {
                setCurrentSlide(current => {
                    if (current !== -1 && current >= 0 && current <= prev.length) {
                        SlideAPI.DeleteSlide(params.id, prev[current].id);
                    }
                    return current;
                })
                return prev;
            })
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <signalrContext.Provider url={'http://localhost:5000/user-hub'}>
            <div className={styles.wrapper}>
                <title>Itransition Task 6</title>
                <Header 
                    key={presentation.connectedUsers?.length ?? "0"}
                    name={presentation.name}
                    currentTool={currentTool}
                    setTool={setTool}
                    users={presentation.connectedUsers}
                />
                <div className={styles.content}>
                    <div className={styles.left}>
                        <div className={styles.slides}>
                            {slides
                                .sort((a, b) => a.index - b.index)
                                .map((slide, index) => {
                                    return (
                                        <Slide 
                                            key={slide.index}
                                            number={slide.index + 1} 
                                            onClick={() => setCurrentSlide(index)}
                                            isCurrent={currentSlide === index} 
                                        />
                                    )
                            })}
                        </div>
                        <div className={styles.create} onClick={() => SlideAPI.AddSlide(params.id)}>
                            <img src={add} draggable="false" />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.editor}>
                            {slides.length > 0 && 
                                <Sheet 
                                    currentTool={currentTool}
                                    setTool={setTool}
                                />
                            }
                        </div>
                        <div className={styles.control}>
                            <span>Slide {currentSlide + 1} of {slides.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </signalrContext.Provider>
    );
});

export default PresentationPage;
