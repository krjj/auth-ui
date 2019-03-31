import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { BrowserRouter as Redirect } from "react-router-dom"
import ReactCountryFlag from "react-country-flag"
import {
    Page,
    Grid,
    Card,
    Table,
    Button,
    Dimmer,
    Tag
} from "tabler-react";


import SiteWrapper from './sitewrapper'

import Cookies from 'js-cookie'
import { API_URL } from '../constants.js'


class UserLookup extends Component {

    state = {
        curSessData: [],
        activeSessData: [],
        loading: false,
        loadingButton: false,
        toogleSessionListCard: true,
        searchTerm: '',
        userid: Cookies.get('userid'),
        logoutButton: false
    }

    async componentDidMount() {
        axios.defaults.headers['x-session-id'] = Cookies.get('session-id')
        await this.getCurrentSessionData()
        await this.getActiveSessionData()
    }



    async getCurrentSessionData() {
        let tableItems = []
        try {
            await this.setState({ toogleSessionListCard: false })
            await this.setState({ loading: true })


            tableItems.push({
                key: 0,
                item: [
                    { content: Cookies.get('username') },
                    { content: Cookies.get('email') },
                    { content: Cookies.get('session-id') },
                    { content: Cookies.get('ref') }
                ]
            })

            await this.setState({ curSessData: tableItems })
            await this.setState({ loading: false })
        } catch (e) {
            await this.setState({ curSessData: [] })
            await this.setState({ toogleSessionListCard: true })
            await this.setState({ loading: false })
        }
    }



    async getActiveSessionData() {
        let tableItems = []
        await this.setState({ activeSessData: [] })
        try {
            await this.setState({ toogleSessionListCard: false })
            await this.setState({ loading: true })

            let { data } = await axios.get(`${API_URL}/activeSession`)
            await data.data.useractivity.map((item, i) => {
                tableItems.push({
                    key: i,
                    item: [
                        { content: item.ip },
                        { content: item.device },
                        { content: (item.location !== null) ? (item.location.country === '' || item.location.country === null) ? <React.Fragment><Tag>NOT AVAILABLE</Tag></React.Fragment> : <React.Fragment><ReactCountryFlag code={item.location.country} svg /> &nbsp; {item.location.country}</React.Fragment> : <React.Fragment><Tag>NOT AVAILABLE</Tag></React.Fragment> },
                        { content: (item.location !== null) ? (item.location.city === '' || item.location.city === null) ? <React.Fragment><Tag>NOT AVAILABLE</Tag></React.Fragment> : <React.Fragment> {item.location.city}</React.Fragment> : <React.Fragment><Tag>NOT AVAILABLE</Tag></React.Fragment> },
                        { content: moment(item.loginTime).format('MMM DD YYYY, hh:mm:ss a') },
                        { content: item.ref },
                        {
                            content: (
                                <React.Fragment>
                                    {Cookies.get('ref') !== item.ref ? (<Button
                                        color="secondary"
                                        size="sm"
                                        onClick={() => { this.logoutSession(item.ref) }}
                                    >
                                        Delete
                                    </Button>) : (<Tag color="lime">CURRENT SESSION</Tag>)
                                    }

                                </React.Fragment>
                            ),
                        }
                    ]
                })
            })
            await this.setState({ activeSessData: tableItems })
            await this.setState({ loading: false })
        } catch (e) {
            await this.setState({ activeSessData: [] })
            await this.setState({ toogleSessionListCard: true })
            await this.setState({ loading: false })
        }
    }


    async logoutSession(ref) {
        await axios.delete(`${API_URL}/session`, {
            data: {
                "ref": ref
            }
        })
        await this.getActiveSessionData()
    }

    async logoutSessionAll() {
        this.setState({ loadingButton: true })
        await axios.delete(`${API_URL}/session`, {
            data: {
                invalidateAll: true
            }
        })
        await Cookies.remove('session-id')
        await Cookies.remove('email')
        this.setState({ loadingButton: false })
        this.setState({ logout: true })
    }

    render() {
        if (this.state.logout)
            return (<Redirect to={{
                pathname: '/',
                state: {}
            }} />)
        return (
            <SiteWrapper>
                <Page.Content>
                    {this.state.toogleSessionListCard === true ? (
                        <Grid.Row>
                            <Grid.Col width={12}>

                                <Card statusColor="blue">
                                    <Card.Header>
                                        <Card.Title>Current Session Data</Card.Title>
                                        <Card.Options>
                                            <Button color="primary" size="sm" onClick={() => this.setState({ toogleSessionListCard: false })}>
                                                Display All Active Sessions
                                        </Button>
                                        </Card.Options>
                                    </Card.Header>
                                    <Table
                                        responsive={true}
                                        className="card-table table-vcenter text-nowrap"
                                        headerItems={[
                                            { content: "Username" },
                                            { content: "Email" },
                                            { content: "SessionId" },
                                            { content: "Session Ref" },
                                        ]}
                                        bodyItems={this.state.curSessData}
                                    />
                                </Card>



                            </Grid.Col>
                        </Grid.Row>
                    ) : (
                            <Grid.Row >
                                <Grid.Col width={12}>
                                    <Dimmer active={this.state.loading} loader>
                                        <Card statusColor="blue">
                                            <Card.Header>
                                                <Card.Title>Active Sessions</Card.Title>
                                                <Card.Options>

                                                    <Button color="primary" size="sm" onClick={() => this.getActiveSessionData()}>
                                                        Refresh
                                                    </Button>
                                                    &nbsp;
                                                    <Button color="primary" size="sm" onClick={() => this.setState({ toogleSessionListCard: true })}>
                                                        Back To Current Session Data
                                                    </Button>

                                                </Card.Options>
                                            </Card.Header>
                                            <Card.Body>
                                                <Table
                                                    responsive={true}
                                                    className="card-table table-vcenter text-nowrap"
                                                    headerItems={[
                                                        { content: "IP Address" },
                                                        { content: "Device" },
                                                        { content: "Country" },
                                                        { content: "City" },
                                                        { content: "Login Time" },
                                                        { content: "Session Ref" },
                                                        { content: null }
                                                    ]}
                                                    bodyItems={this.state.activeSessData}
                                                />
                                            </Card.Body>
                                            <Card.Footer><Button loading={this.state.loadingButton} disabled={this.state.loadingButton} color="secondary" size="sm" onClick={() => { this.logoutSessionAll() }}>
                                                Logout from all devices
                                        </Button></Card.Footer>
                                        </Card>
                                    </Dimmer>
                                </Grid.Col>
                            </Grid.Row>
                        )}
                </Page.Content>
            </SiteWrapper >
        );
    }
}

export default UserLookup