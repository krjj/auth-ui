import React, { Component } from 'react';
import { NavLink, withRouter, Redirect } from "react-router-dom";
import axios from 'axios'
import { API_URL } from '../constants.js'
import {
    Site,
    Grid,
    List,
    RouterContextProvider,
} from "tabler-react";
import "../tabler-dist/Tabler.css";
import Cookies from 'js-cookie'

const navBarItems = [
    { value: "Session Data", to: "/user-lookup", icon: "search", LinkComponent: withRouter(NavLink) }
]

class SiteWrapper extends Component {

    state = { logout: false }

    async handleLogout() {
        await Cookies.remove('session-id')
        await Cookies.remove('email')
        await axios.delete(`${API_URL}/session`, {
            data: {
                "self": true
            }
        })
        this.setState({ logout: true })
    }

    async componentDidMount() {
        axios.defaults.headers['x-session-id'] = Cookies.get('session-id')
    }

    render() {
        if (this.state.logout)
            return (<Redirect to={{
                pathname: '/',
                state: {}
            }} />)

        return (
            <Site.Wrapper
                headerProps={{
                    href: "/",
                    alt: "Tabler React",
                    imageURL: "images/logo.png",
                    accountDropdown: {
                        avatarURL: "/images/avatar.png",
                        name: Cookies.get('email'),
                        description: "Normal User",
                        options: [
                            { icon: "log-out", value: "Sign out", onClick: () => { this.handleLogout() } },
                        ],
                    }
                }}
                navProps={{ itemsObjects: navBarItems }}
                routerContextComponentType={withRouter(RouterContextProvider)}
                footerProps={{
                    copyright: (
                        <React.Fragment>
                            Developed by
                        <a
                                href="https://www.linkedin.com/in/kshitij-jamdade/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {" "}
                                Kshitij Jamdade.
                        </a>{" "}
                            Intended as assignment for Shipwaves Inc.
                      </React.Fragment>
                    ),
                    nav: (
                        <React.Fragment>
                            <Grid.Col auto={true}>
                                <List className="list-inline list-inline-dots mb-0">
                                    <List.Item className="list-inline-item">
                                        
                                    </List.Item>
                                    <List.Item className="list-inline-item">
                                        
                                    </List.Item>
                                </List>
                            </Grid.Col>
                        </React.Fragment>
                    ),
                }}
            >

                {this.props.children}
            </Site.Wrapper>
        );
    }
}

export default SiteWrapper