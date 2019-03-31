import React, { Component } from 'react'
import "tabler-react/dist/Tabler.css";
import {  Form, Button, Card, Dimmer } from "tabler-react";
import axios from 'axios'
import { API_URL } from '../constants.js'
class Signup extends Component {
    state = {
        username: '',
        password: '',
        email: '',
        loading: false,
        error: false,
        errormsg: 'Error encountered',
        success: false,
        successmsg: 'Error encountered'
    }

    async handleSignup() {
        try {
            await this.setState({ loading: true, success: false, successmsg: '' })
            await axios.post(`${API_URL}/register`, {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            })
            await this.setState({ loading: false, error: false, success: true, successmsg: 'Account Created. Redirecting to login page.', errormsg: '' })

            setTimeout(() => {
                this.props.history.push('/login')
            }, 3000)

        } catch (error) {
            await this.setState({ loading: false, error: true, errormsg: 'Cannot Signup' })
            console.log(error.response)
            try {
                if (error.response.data.errorCode === 'DUPLICATE_ACCOUNT') {
                    await this.setState({ loading: false, error: true, errormsg: error.response.data.message })
                }
                if (error.response.data.error === 'Bad Request') {
                    await this.setState({ loading: false, error: true, errormsg: 'Validation Error' })
                }
                if (error.response.status === 500) {
                    await this.setState({ loading: false, error: true, errormsg: 'Something went wrong' })
                }
            } catch (e) {
                await this.setState({ loading: false, error: true, errormsg: 'Something went wrong' })
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
                                    {this.state.success === true ?
                                        (
                                            <Card.Alert color="success">
                                                {this.state.successmsg}
                                            </Card.Alert>
                                        ) :
                                        (<span />)
                                    }
                                    <Dimmer active={this.state.loading} loader>
                                        <Card.Body className="p-6">
                                            <Card.Title RootComponent="div">Create New Account</Card.Title>
                                            <Form.Input label='Username' placeholder='Enter username' icon='user' value={this.state.username} onChange={(e) => { this.setState({ username: e.target.value }) }}></Form.Input>
                                            <Form.Input label='Email' placeholder='Enter email address' icon='user' value={this.state.email} onChange={(e) => { this.setState({ email: e.target.value }) }}></Form.Input>
                                            <Form.Input label='Password' placeholder='Enter password' icon='lock' type='password' value={this.state.password} onChange={(e) => { this.setState({ password: e.target.value }) }}></Form.Input>
                                            <Form.Footer>
                                                <Button color="primary" block={true} onClick={() => { this.handleSignup() }}>
                                                    Register
                                                </Button>
                                                <Button outline color="primary" block={true} onClick={() => { this.props.history.push('/login') }}>
                                                    Go To Login
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

export default Signup