// Dependencies
import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';


var complete_marker_list = {name: {}, lat: {}, long: {}};
var marker_list = {name: {0:0},cant: {0:0}, lat: {0:0}, long: {0:0}};

class BMap extends Component {
  constructor(props) {
    super(props)
    this.state = { termino: 'no', valoraciones: [], text: '', userok: ''}
    this.handleInputChange = this.handleChange.bind(this)
    this.handleInputSubmit = this.handleSubmit.bind(this)
}

onClick(e){
  e.preventDefault();
}
handleChange(e){
  this.setState({text:e.target.value})
}

handleSubmit(e){
  e.preventDefault();
}

componentWillMount(){

  fetch('http://localhost:8081/sellMap')
      .then(function(datain) {
        return datain.text()
      })
      .then(function(dats){
        if (dats !== "No existe tal usuario."){

        console.log(dats)
        var data = JSON.parse(dats)
        console.log(data)
        marker_list = {name: {0:0},cant: {0:0}, lat: {0:0}, long: {0:0}};

        //var data = JSON.parse(localStorage.getItem('clientsOrders'));

        var cont = 0;
        var cont2 = 0;

        for (var i = 0; i < data.results.length; i++) {
          if (data.results[i].shipping.receiver_address !== undefined) {
            if (data.results[i].shipping.receiver_address.latitude !== null) {

              complete_marker_list.name[cont] = data.results[i].buyer.nickname;
              complete_marker_list.lat[cont] = data.results[i].shipping.receiver_address.latitude;
              complete_marker_list.long[cont] = data.results[i].shipping.receiver_address.longitude;
              cont++;
            }
          }
        }

        for (var x = 0; x < Object.keys(complete_marker_list.lat).length; x++) {

          for (var y = 0; y < Object.keys(marker_list.lat).length; y++) {
        
            if(complete_marker_list.lat[x] === marker_list.lat[y] && complete_marker_list.long[x] === marker_list.long[y]){

                if (marker_list.cant[y] === undefined) {
                  marker_list.cant[y] = 1;
                }else{
                  marker_list.cant[y] = marker_list.cant[y] + 1;
                }
                break;

            }else if(y === Object.keys(marker_list.lat).length - 1){

              marker_list.name[cont2] = complete_marker_list.name[x];
              marker_list.lat[cont2] = complete_marker_list.lat[x];
              marker_list.long[cont2] = complete_marker_list.long[x];
              cont2++;
            }else if(marker_list.cant[y] === 0){
              marker_list.cant[y] = 1;
            }

          }
        }
        console.log(marker_list)
        localStorage.setItem('markerList',JSON.stringify(marker_list));
        }else{

          

        }
      })
}

  render() {

    var ml = JSON.parse(localStorage.getItem('markerList'));
    
    var makers = [];

    function makeMarkers(){
      for (var i = 0;i<Object.keys(ml.lat).length;i++){
        makers.push(<Marker position={[ml.lat[i], ml.long[i]]}><Popup>{ml.name[i] + " : " + ml.cant[i] + " compra/s"}</Popup></Marker>);
        console.log(ml.cant[i])
      }

      return makers;
    }

    return (
      <div className="BMap">
        <h1 style={{textAlign: 'center'}}>MAP PAGE</h1>

        <div style={{textAlign: 'center', padding:'20px'}}>
            <form onSubmit= {this.handleInputSubmit}>
              <label htmlFor="new-todo">
                Vendedor:
              </label>
              <input
                id="new-todo"
                onChange={this.handleInputChange}
                value={this.state.text}>
              </input>
              <button>
                Buscar
              </button>
            </form>
          </div>
        
        <div>
          <Map style={{ display: 'block',marginLeft: 'auto',marginRight: 'auto',height: '500px', width: '700px' }} center={[-34.304573, -64.76381]} zoom={3} maxZoom={17}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup maxClusterRadius={120}>
              {makeMarkers()}
            </MarkerClusterGroup>
          </Map>
        </div>
      </div>
    );
  }
}

export default (BMap);
