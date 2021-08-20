import React, { Component } from "react";
import { SocialIcon } from 'react-social-icons'
import Sidebar from "react-sidebar";

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import AccountCirle from '@material-ui/icons/AccountCircle';
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import Laptop from '@material-ui/icons/Laptop'
import MenuIcon from '@material-ui/icons/Menu';
import Timeline from '@material-ui/icons/Timeline';
import SentimentSatisfied from '@material-ui/icons/SentimentSatisfied';

import Introduction from './../introduction/Introduction'
import About from './../about/About'
import Portfolio from './../portfolio/Portfolio'
import Blog from './../blog/Blog'

import AuthorImage from './img/sidebar_img.png'
import SocialMedia from './js/SocialMedia.js'


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/sidebar.css'


// based off: https://codesandbox.io/s/4ybqx


function ListItemLink(props){
  return <ListItem button component="a" {...props} />;
}

const mql = window.matchMedia(`(min-width: 900px)`);

class NavContent extends Component {
  render(){
    return(
      <div id="sidebar">
        <aside id="sidebar-aside">
            <div>
                <img src={ AuthorImage } className="author-image" alt="author" />
                <h1 id="author-name">Jenard Kin Cabia</h1>
                <span className="email">
                    <MailOutlineIcon></MailOutlineIcon>
                    nardjay1997@gmail.com
                </span>
            </div>
            <div id="aside-navigation">
            <List component="nav" aria-label="navigation">
                <ListItemLink href="#main-intro">
                    <ListItemIcon>
                        <SentimentSatisfied/>
                    </ListItemIcon>
                    <ListItemText primary="Introduction" />
                </ListItemLink>
                <ListItemLink href="#main-about">
                    <ListItemIcon>
                        <AccountCirle/>
                    </ListItemIcon>
                    <ListItemText primary="About" />
                </ListItemLink>
                <ListItemLink href="#main-portfolio">
                    <ListItemIcon>
                        <Laptop/>
                    </ListItemIcon>
                    <ListItemText primary="Projects" />
                </ListItemLink>
                <ListItemLink href="#main-blog">
                    <ListItemIcon>
                        <Timeline/>
                    </ListItemIcon>
                    <ListItemText primary="Blog" />
                </ListItemLink>
            </List>
            </div>
            <hr/>
            <div id="aside-social-media">
            <List component="nav" aria-label="social media">
                <SocialIcon url={SocialMedia.facebook}></SocialIcon>
                <SocialIcon url={SocialMedia.twitter}></SocialIcon>
                <SocialIcon url={SocialMedia.instagram}></SocialIcon>
                <SocialIcon url={SocialMedia.twitch}></SocialIcon>
                <SocialIcon url={SocialMedia.youtube}></SocialIcon>
                <SocialIcon url={SocialMedia.reddit}></SocialIcon>
                <SocialIcon url={SocialMedia.linkedin}></SocialIcon>
                <SocialIcon url={SocialMedia.github}></SocialIcon>
            </List>
            </div>
        </aside>
      </div>
    )
  }
}

 
class SidebarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false
      
    };
 
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }
 
  componentDidMount() {
    mql.addEventListener( "change", this.mediaQueryChanged );
  }
 
  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }
 
  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }
 
  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }
 
  render() {
    return (
      <div id="container-page">
        <div id="container-wrap">
          <Sidebar
            sidebar={<NavContent/>}
            open={this.state.sidebarOpen}
            docked={this.state.sidebarDocked}
            onSetOpen={this.onSetSidebarOpen}
          >
          <MenuIcon className='open-sidebar-btn' onClick={() => this.onSetSidebarOpen(true)} />
          <div id="container-main">
            <Introduction></Introduction>
            <About></About>
            <Portfolio></Portfolio>
          </div>
          </Sidebar>
        </div>
      </div>
      
    );
  }
}
 
export default SidebarComponent;