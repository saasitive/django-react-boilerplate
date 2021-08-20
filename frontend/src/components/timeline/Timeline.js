import React, { Component } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import './css/Timeline.css'

class Timeline extends Component {
    render(){
        return(
            <div>
                <ScrollAnimation animateIn="bounceInLeft" delay={7} animateOnce={true}>
                    <section id="main-timeline">
                        <div className="main-timeline-content">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row row-bottom-padded-sm">
                                        <div className="col-md-12">
                                            <div className="timeline-desc">
                                            <span className="heading-span">History of Events</span>
                                                <h2 className="heading-header2">Timeline</h2>
                                                <p></p>
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

export default Timeline