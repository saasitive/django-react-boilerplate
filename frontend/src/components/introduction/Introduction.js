import React, { Component } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel'
import ScrollAnimation from 'react-animate-on-scroll'

import Projects from './img/projects.jpg'
import Helix from './img/helix.jpg'
import Graduation from './img/graduations.png'
import './css/Introduction.css'

class Introduction extends Component {

    render(){
        return(
            <div>
                <section id="main-intro">
                    <ScrollAnimation animateIn='fadeIn' offset = {0} delay = {3} duration = {5} animateOnce = {true}>
                        <Carousel>
                            <div className = 'main-intro-content'>
                                <h1 className = 'carousel-text one'>Hello<span style={ {color: 'black'} } > I'm Jenard</span></h1>
                                <h2 className = 'carousel-text one'>I am a developer.</h2>
                                <img src = {Helix} alt = 'intro' />
                            </div>
                            <div className = 'main-intro-content'>
                                <div className = 'transparent transparent-two-small'></div>
                                <h2 className = 'carousel-text two'>I have a degree in</h2>
                                <div className = 'transparent transparent-two'></div>
                                <h1 className = 'carousel-text two'>Software Engineering</h1>
                                <img src = {Graduation} alt = 'edu' />
                            </div>
                            <div className ='main-intro-content'>
                                <div className = 'transparent transparent-three'></div>
                                <h1 className = 'carousel-text three'>My Work</h1>
                                <img src = {Projects} alt = 'proj' />
                            </div>
                        </Carousel>
                    </ScrollAnimation>
                </section>
            </div>
        )
    }
}

export default Introduction