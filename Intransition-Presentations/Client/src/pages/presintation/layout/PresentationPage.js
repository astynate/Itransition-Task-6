import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createSignalRContext } from "react-signalr/signalr";
import styles from './main.module.css';
import Sheet from '../elements/sheet/Sheet';
import Header from '../widgets/header/Header';
import Slide from '../elements/slide/Slide';
import add from './images/add.svg';
import { observer } from 'mobx-react-lite';
import userState from '../../../state/userState';
import SlideAPI from '../api/SlideAPI';
import { IsUserHasEditPermission } from '../../home/features/users/Users';

export const signalrContext = createSignalRContext();

const PresentationPage = observer(() => {
    const [presentation, setPresentation] = useState({});
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(-1);
    const [currentTool, setTool] = useState(0);
    const [isToolBarOpen, setToolbarOpenState] = useState(false);
    const [isUserHasEditPermission, SetEditPerission] = useState(false);
    const headerRef = useRef();

    const [textStyles, setTextStyles] = useState({
        textAlign: 'left',
        textDecoration: 'none',
        fontWeight: '400',
        fontStyle: 'normal',
        fontFamily: 'Tahoma',
        fontSize: '24px'
    });
    
    let params = useParams();

    useEffect(() => {
        SetEditPerission(
            IsUserHasEditPermission(presentation, { 
                username: localStorage.getItem('username') 
            })
        );
    }, [presentation]);

    signalrContext.useSignalREffect(
        "ChangePermissions",
        (data) => {
            const { id, user, permission } = JSON.parse(data);

            if (id === presentation.id) {
                setPresentation(prev => {
                    let permissionModel = prev.permissions.find(e => e.username === user);

                    if (permissionModel) {
                        permissionModel.permission = permission;
                    } else {
                        prev.permissions = [...prev.permissions, {
                            username: user,
                            presentationId: id,
                            permission: permission
                        }];
                    }
    
                    return { ...prev };
                });
            }
        }
    );

    signalrContext.useSignalREffect(
        "JoinedPresentation",
        (data) => {
            const { presentation, slides } = JSON.parse(data);

            setPresentation(presentation ?? {});
            setSlides(slides ?? []);
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
        "AddText",
        (data) => {
            const model = JSON.parse(data);
            
            setSlides(prev => {
                return prev.map(slide => {
                    if (slide.id === model.slideId) {
                        slide.texts = [...slide.texts, model];
                    }

                    return slide;
                })
            });
        }
    );

    signalrContext.useSignalREffect(
        "DeleteText",
        (data) => {
            setSlides(prev => {
                return prev.map(slide => {
                    slide.texts = slide.texts.filter(e => e.id !== data);
                    return slide;
                })
            });
        }
    );

    signalrContext.useSignalREffect(
        "UpdateText",
        (data) => {
            const model = JSON.parse(data);

            setSlides(prevSlides => {
                const result = prevSlides.map(slide => {
                    slide.texts = slide.texts.map(textModel => {
                        if (textModel.id === model.id) {
                            return model;
                        }
                        return textModel;
                    });

                    return { ...slide };
                });

                return result;
            });
        }
    );    

    signalrContext.useSignalREffect(
        "ChangeName",
        (data) => {
            const {id, name} = JSON.parse(data);

            if (id === presentation.id) {
                setPresentation(prev => {
                    return { ...prev, name: name };
                });
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

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Delete') {
                setSlides(prev => {
                    setCurrentSlide(current => {
                        if (current !== -1 && current >= 0 && current < prev.length && prev[current].id) {
                            SlideAPI.DeleteSlide(params.id, prev[current].id);
                        }
                        return current;
                    })
                    return prev;
                })
            }
        }

        window.addEventListener('keydown', handleKeyPress);
        
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <signalrContext.Provider url={'http://localhost:5000/user-hub'}>
            <div className={styles.wrapper}>
                <title>Itransition — Presentation Editor</title>
                <Header 
                    headerRef={headerRef}
                    key={presentation.connectedUsers?.length + presentation ?? "0"}
                    nameValue={presentation.name}
                    currentTool={currentTool}
                    setTool={setTool}
                    isToolBarOpen={isToolBarOpen}
                    users={presentation.connectedUsers}
                    presentation={presentation}
                    setTextStyles={setTextStyles}
                    textStyles={textStyles}
                />
                <div className={styles.content} id={isToolBarOpen ? "open" : null}>
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
                                            slide={slide}
                                            type={presentation.type}
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
                                    key={slides}
                                    currentTool={currentTool}
                                    setTool={setTool}
                                    slide={slides[currentSlide]}
                                    headerRef={headerRef}
                                    setToolbarOpenState={setToolbarOpenState}
                                    textStyles={textStyles}
                                    setAdditionalStyles={setTextStyles}
                                    isEditable={isUserHasEditPermission}
                                    type={presentation.type}
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
