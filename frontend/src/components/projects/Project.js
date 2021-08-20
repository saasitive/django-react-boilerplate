import React, { Component } from 'react'
import ProfessionalData from './data/professional.json'
import PersonalData from './data/personal.json'
import ScrollAnimation from 'react-animate-on-scroll'

import './css/Project.css'


/* replace this logic with DJango REST API */
function epochTimeConverter( time ){

    if( typeof time != 'number' )
        return 0;

    var date = new Date(0);
    date.setUTCMilliseconds( time );

    return date.toISOString().slice(0, 10);
}


export const ProfessionalLastUpdated =  epochTimeConverter( new File([],'./data/professional.json').lastModified );
export const PersonalLastUpdated = epochTimeConverter( new File([], './data/personal.json' ).lastModified );
export const AllProjectsLastUpdated = ProfessionalLastUpdated < PersonalLastUpdated ? PersonalLastUpdated : ProfessionalLastUpdated;

export class Project extends Component{
    constructor(props){
        super(props);
        this.createProject = this.createProject.bind(this);
        this.state = { 
            contentType: 'all',
            component: [],
            divider: 'All Projects',
            header: 'ALL PROJECTS',
        };
    }

    createProject(data, index){       
        let state = this.state;
        let key = state.contentType + '-' + index;

        let overview = []
        Object.keys(data['Details']).forEach(function( header, index ){
            overview.push(
                <p key={state.contentType + '-' + 'details' + index}>
                    <span className="project-span">{ header + ':    ' }</span>
                    {data['Details'][header]}
                </p>
            )
        });

        return(
            //<ScrollAnimation key={key} animateOnce={true} animateIn="fadeIn">
            <div key={key}>
                    <div className="row portfolio-panel-content">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <p className="divider">{ state.divider }<br/></p>
                            <h2 className="project-title">{ data.Title }</h2>
                            <div className="col-sm-6 project-overview"> { overview }</div>
                            <div className="col-sm-6 project-image-div" >
                                <img className="project-image" src={process.env.PUBLIC_URL + data['Project Image Path']} alt={state.contentType + '-' + 'image'}></img>
                            </div>
                        </div>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <p className="project-text"><b>Project Description: </b>{data['Project Description']}</p>
                        </div>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <p className="project-text"><b>My Involvement: </b>{data['My Involvement']}</p>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
            </div>
            //</ScrollAnimation>
        );
    }

    render(){
        let state = this.state;
        let createProject = this.createProject;
        state.component.push(<p key={'header'} className="project-header">{ state.header }</p>  );
        let professionalData = JSON.parse( JSON.stringify( ProfessionalData ) );
        let personalData = JSON.parse( JSON.stringify( PersonalData ) );
        let data = Object.assign( professionalData, personalData );
        Object.keys(data).forEach(function(key, index) {
            state.component.push( createProject(data[key], index ) );
        })
        return state.component;
    }
}

export class Professional extends Project{
    constructor(props){
        super(props);
        this.state = { 
            contentType: 'professional',
            component: [],
            divider: 'PROFESSIONAL',
            header: 'PROFESSIONAL PROJECTS',
        };
    }

    render(){
        let state = this.state;
        let createProject = this.createProject;
        state.component.push(<p key={'header'} className="project-header">{ state.header }</p>  )
        Object.keys(ProfessionalData).forEach(function(key, index) {
            state.component.push( createProject(ProfessionalData[key], index ) );
        })
        return state.component;
    }
}

export class Personal extends Project{
    constructor(props){
        super(props);
        this.state = { 
            contentType: 'personal',
            component: [],
            header: 'PERSONAL PROJECTS',
            divider: 'PERSONAL',
        };
    }
    render(){
        let state = this.state;
        let createProject = this.createProject;
        state.component.push(<p key={'header'} className="project-header">{ state.header }</p>  )
        Object.keys(PersonalData).forEach(function(key, index) {
            state.component.push( createProject(PersonalData[key], index ) );
        })
        return state.component;
    }
}
