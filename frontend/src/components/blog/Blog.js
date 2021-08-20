import React, { Component } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';
import './css/Blog.css'

class Blog extends Component {
    render(){
        return(
            <div>
                <ScrollAnimation animateIn="bounceInRight" delay={5} animateOnce={true}>
                    <section id="main-blog">
                        <div className="main-blog-content">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row row-bottom-padded-sm">
                                        <div className="col-md-12">
                                            <div className="blog-desc">
                                                <span className="heading-span">Recent Updates</span>
                                                <h2 className="heading-header2">Blog</h2>
                                                <TwitterTimelineEmbed
                                                    sourceType="profile"
                                                    screenName="jkcabia"
                                                    options={{height: 400}}
                                                />
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

export default Blog