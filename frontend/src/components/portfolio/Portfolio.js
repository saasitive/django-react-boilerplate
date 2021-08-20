import React, { Component } from 'react'
import { Card, CardDeck } from 'react-bootstrap'
import './css/Portfolio.css'

import AllProjects from './img/all_projects.png'
import ProfessionalProjects from './img/professional_projects.png'
import PersonalProjects from './img/personal_projects.png'

import { Project, Professional, ProfessionalLastUpdated, PersonalLastUpdated, Personal, AllProjectsLastUpdated} from './../projects/Project'

class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {contentShown: null};

        // This binding is necessary to make 'this' work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(showContent){
        let content = showContent;
        if (this.state.contentShown )
            if (content.type === this.state.contentShown.type)
                content = null;
        this.setState(prevState => ({contentShown: content}));
    }

    render(){
        const contentShown = this.state.contentShown;

        return(
            <div>
                <section id="main-portfolio">
                    <div className="main-portfolio-content">
                        <div className="row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="row row-bottom-padded-sm">
                                    <div className="porfolio-desc">
                                        <span className="heading-span">My Works</span>
                                        <h2 className="heading-header2">Portfolio</h2>
                                        <p>
                                            This section is a collection of projects that I have been part of in my professional career as well as my own.
                                            Click the images below to browse through the projects.
                                        </p>
                                    </div>
                                    <div className="portfolio-panel-control">
                                        <CardDeck>
                                            <Card onClick={this.handleClick.bind(this, <Project />)}>
                                                <Card.Img variant="top" src={ AllProjects }/>
                                                <Card.Body>
                                                    <Card.Title>All Projects</Card.Title>
                                                    <Card.Text>
                                                        Here's a list of all of my work I have done from the moment I started coding!
                                                    </Card.Text>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <small className="text-muted">Last Updated: {AllProjectsLastUpdated}</small>
                                                </Card.Footer>
                                            </Card>
                                            <Card onClick={this.handleClick.bind(this, <Professional/>)}>
                                                <Card.Img variant="top" src={ ProfessionalProjects }/>
                                                <Card.Body>
                                                    <Card.Title>Professional Projects</Card.Title>
                                                    <Card.Text>
                                                        Care to see some of the work I have done professionally?
                                                    </Card.Text>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <small className="text-muted">Last Updated: {ProfessionalLastUpdated}</small>
                                                </Card.Footer>
                                            </Card>
                                            <Card onClick={this.handleClick.bind(this, <Personal/>)}>
                                                <Card.Img variant="top" src={ PersonalProjects }/>
                                                <Card.Body>
                                                    <Card.Title>Personal Projects</Card.Title>
                                                    <Card.Text>
                                                        Click here to see a list of all the shenanigans that I have been up to. 
                                                    </Card.Text>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <small className="text-muted">Last Updated: {PersonalLastUpdated}</small>
                                                </Card.Footer>
                                            </Card>
                                        </CardDeck>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-1"></div>
                        </div>
                        { contentShown }
                    </div>
                </section>
            </div>
        )
    }
}

export default Portfolio