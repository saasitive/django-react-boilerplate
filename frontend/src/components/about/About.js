import React, { Component } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import './css/About.css'

class About extends Component {

    render(){
        return(
            <div>
                <ScrollAnimation animateIn="bounceInLeft" delay={3} animateOnce={true}>
                    <section id="main-about">
                        <div className="main-about-content">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row row-bottom-padded-sm">
                                        <div className="col-md-12">
                                            <div className="about-desc">
                                                <span className="heading-span">About Me</span>
                                                <h2 className="heading-header2">Who Am I?</h2>
                                                <p>
                                                    I am currently working full-time as a Junior Web Developer for H.G. Smith &amp; Associates, a human resources consulting firm based in Cochrane, Alberta.
                                                    But when I am not coding away at my desk during work hours, I am probably either watching sports, out eating with friends, working out, or scrolling through my social media feeds;
                                                    most likely ranting or spreading memes on Twitter. Otherwise, then I am infront of a screen gaming or creating something out of curiousity such as this website
                                                    <span role="img" aria-label="emoji"> &#128521;</span>.
                                                </p>
                                                <p>
                                                   How did I get here? Well, out of high school I enjoyed sports but was never athletic enough to pursue it as a career.
                                                   Thankfully I actually studied during those times so I was fortunate enough to enter university with good grades. Fast-forward to years later, I finished my tenure
                                                   in the University of Calgary and earned my Bachelor of Science Degree majoring in Software Engineering. It definitely wasn't easy, heck it was
                                                   the most stressful stretch I had in a while, but it was worth it. I met lots of great people, became more independent, and pushed myself
                                                   to new limits in terms of focus and determination whilst having fun and discovering new things about computers and technologies, and of course myself. 
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </ScrollAnimation>
            </div>
        )
    }
}

export default About