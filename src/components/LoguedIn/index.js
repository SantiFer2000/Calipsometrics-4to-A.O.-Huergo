// Dependencies
import React, { Component } from 'react';
import { parse } from 'query-string';

var url = 'https://api.mercadolibre.com/oauth/token?';


var options = {
   form: {
    "grant_type":"authorization_code",
    "client_id": '6722315906287226',
    "client_secret": 'su5nxkJECtvTyYp5GGVlGcy8QicnzeAI',
    "redirect_uri": "http://localhost:3000/logued_in",
    "code": ""
   },
   method: "POST", 
   headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json' 
   }
};

class LoguedIn extends Component {

  componentWillMount(){

    const URLSearchParams = window.URLSearchParams;

    var burl = new URLSearchParams();

    burl.append("grant_type","authorization_code")
    burl.append("client_id", '6722315906287226')
    burl.append("client_secret", 'su5nxkJECtvTyYp5GGVlGcy8QicnzeAI',)
    burl.append("code",parse(this.props.location.search).code);
    burl.append("redirect_uri",options.form.redirect_uri)

    var aurl = url + burl

    console.log(aurl)

    fetch("http://localhost:8081/logued_in?code="+parse(this.props.location.search).code)
      .then(function(response){ 
        console.log('datos_enviados_al_server_para_que_pida_token_y_lo_guarde')
        
    }); 
    
  }

  render() {
    return (
      <div className="LoguedIn">
        <h1 style={{textAlign: 'center'}}>YOU ARE LOGUED</h1>
      </div>
    );
  }
  
}

export default LoguedIn;