import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "animate.css/animate.min.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Cookies from 'universal-cookie';
 
/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);



Name	Domain & Path
lang	cdn.syndication.twimg.com/
lang	syndication.twitter.com/

Name	Domain & Path
_ga	.twitter.com/
kdt	.twitter.com/
cd_user_id	.twitter.com/
_gid	.twitter.com/
at_check	.twitter.com/
mbox	.twitter.com/

const cookies = new Cookies();
cookies.set( 'lang', 'cdn.syndication.twimg.com', { path: '/', sameSite: 'none', secure: true } )
cookies.set( 'lang', 'syndication.twitter.com', { path: '/', sameSite: 'none', secure: true } )
cookies.set( '_ga', '.twitter.com/', { path: '/', sameSite: 'none', secure: true } )
cookies.set( 'kdt', '.twitter.com/', { path: '/', sameSite: 'none', secure: true } )
cookies.set( 'cd_user_id', '.twitter.com/', { path: '/', sameSite: 'none', secure: true } )
cookies.set( '_gid', '.twitter.com/', { path: '/', sameSite: 'none', secure: true } )
cookies.set( 'at_check', '.twitter.com/', { path: '/', sameSite: 'none', secure: true } )
cookies.set( 'mbox', '.twitter.com/', { path: '.twitter.com/', sameSite: 'none', secure: true } )

*/

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
