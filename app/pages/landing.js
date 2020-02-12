import React, { Component } from 'react';
import axios from 'axios';
// import { request, response } from 'express';

class landingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    };

componentDidMount() {
    const request = {
        abcd:'',
    };
   axios({
       method: 'post',
       url: '/getCustomerDetails',
       data: request,
   }).then((response) => {
       console.log(response);
   }).catch(e => {
       console.log(e)
   })
}

    render() {
        return (
            <div className="container center-text">
                <h1>Hotel Reservation</h1>
            </div>
        ) 
    }
}

export default (landingPage);