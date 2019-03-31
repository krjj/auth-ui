import React, { Component } from 'react'
import "tabler-react/dist/Tabler.css";
import {  Form,  Button, Card, Dimmer } from "tabler-react";
import axios from 'axios'
import Cookies from 'js-cookie'
import { browserName, osName, osVersion, browserVersion } from 'react-device-detect';
import { API_URL } from '../constants.js'

class Login extends Component {
    state = {
        username: '',
        password: '',
        loading: false,
        error: false,
        errormsg: 'Error encountered',
        login: true
    }

    async handleLogin() {
        try {
            await this.setState({ loading: true, error: false })
            let { data } = await axios.post(`${API_URL}/login`, {
                username: this.state.username,
                password: this.state.password,
                deviceName: osName + '-' + osVersion + '/' + browserName + '-' + browserVersion
            })
            await Cookies.set('session-id', data.data.sessionId)
            await Cookies.set('email', data.data.email)
            await Cookies.set('username', data.data.username)
            await Cookies.set('ref', data.data.ref)
            await this.setState({ loading: false, error: false, errormsg: '' })
            this.props.history.push('/')
        } catch (error) {
            if (error.response.status === 403) {
                await this.setState({ loading: false, error: true, errormsg: 'Incorrect Credentials' })
            } else if (error.response.status === 400) {
                await this.setState({ loading: false, error: true, errormsg: 'Validation Error' })
            }
            else {
                await this.setState({ loading: false, error: true, errormsg: 'Cannot Login' })
            }
        }
    }

    render() {
        return (
            <div className="page">
                <div className="page-single">
                    <div className="container">
                        <div className="row">
                            <div className="col col-login mx-auto">
                                <div className="text-center mb-6">
                                    <img src="images/logo.png" className="h-7" alt="" />
                                </div>

                                <Card statusColor="blue">
                                    {this.state.error === true ?
                                        (
                                            <Card.Alert color="danger">
                                                {this.state.errormsg}
                                            </Card.Alert>
                                        ) :
                                        (<span />)
                                    }

                                    <Dimmer active={this.state.loading} loader>
                                        <Card.Body className="p-6">
                                            <Card.Title RootComponent="div">Login to your account</Card.Title>
                                            <Form.Input label='Username or Email' placeholder='Enter username' icon='user' value={this.state.username} onChange={(e) => { this.setState({ username: e.target.value }) }}></Form.Input>
                                            <Form.Input label='Password' placeholder='Enter password' icon='lock' type='password' value={this.state.password} onChange={(e) => { this.setState({ password: e.target.value }) }}></Form.Input>
                                            <Form.Footer>
                                                <Button color="primary" block={true} onClick={() => { this.handleLogin() }}>
                                                    Login
                                                </Button>
                                                <Button outline color="primary" block={true} onClick={() => { this.props.history.push('/signup') }}>
                                                    Go To Register
                                                </Button>
                                            </Form.Footer>
                                        </Card.Body>
                                    </Dimmer>
                                </Card>

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Login