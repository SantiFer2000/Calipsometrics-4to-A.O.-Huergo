// Dependencies
import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {Alert} from 'react-bootstrap';  

//https://asciiart.website/index.php?art=movies/shrek

/*
//////////////////////////////////////////////////////////////////////////////////////////////
///                                                                                        ///
///  Sólo puedo dibujar en el mapa la ubicación del vendedor, no de todos los compradores  ///
///                                                                                        ///
//////////////////////////////////////////////////////////////////////////////////////////////

||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||                                                                                          |||
|||   Sólo puedo dibujar en el mapa la ubicación del vendedor, no de todos los compradores   |||
|||                                                                                          |||
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
\\\                                                                                          \\\
\\\   Sólo puedo dibujar en el mapa la ubicación del vendedor, no de todos los compradores   \\\
\\\                                                                                          \\\ 
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
*/
/*
######################################################################################
#                                                                                    # 
#                            ,.--------._                                            #
#                           /            ''.                                         #
#                         ,'                \     |"\                /\          /\  #
#                /"|     /                   \    |__"              ( \\        // ) #
#               "_"|    /           z#####z   \  //                  \ \\      // /  #
#                 \\  #####        ##------".  \//                    \_\\||||//_/   #
#                  \\/-----\     /          ".  \                      \/ _  _ \     #
#                   \|      \   |   ,,--..       \                    \/|(O)(O)|     #
#                   | ,.--._ \  (  | ##   \)      \                  \/ |      |     #
#                   |(  ##  )/   \ `-....-//       |///////////////_\/  \      /     #
#                     '--'."      \                \              //     |____|      #
#                  /'    /         ) --.            \            ||     /      \     #
#               ,..|     \.________/    `-..         \   \       \|     \ 0  0 /     #
#            _,##/ |   ,/   /   \           \         \   \       U    / \_//_/      #
#          :###.-  |  ,/   /     \        /' ""\      .\        (     /              #
#         /####|   |   (.___________,---',/    |       |\=._____|  |_/               #
#        /#####|   |     \__|__|__|__|_,/             |####\    |  ||                #
#       /######\   \      \__________/                /#####|   \  ||                #
#      /|#######`. `\                                /#######\   | ||                #
#     /++\#########\  \                      _,'    _/#########\ | ||                #
#    /++++|#########|  \      .---..       ,/      ,'##########.\|_||  Donkey By     #
#   //++++|#########\.  \.              ,-/      ,'########,+++++\\_\\ Hard'96       #
#  /++++++|##########\.   '._        _,/       ,'######,''++++++++\                  #
# |+++++++|###########|       -----."        _'#######' +++++++++++\                 #
# |+++++++|############\.     \\     //      /#######/++++ S@yaN +++\                #
#      ________________________\\___//______________________________________         #
#     / ____________________________________________________________________)        #
#    / /              _                                             _                #
#    | |             | |                                           | |               #
#     \ \            | | _           ____           ____           | |  _            #
#      \ \           | || \         / ___)         / _  )          | | / )           #
#  _____) )          | | | |        | |           (  __ /          | |< (            #
# (______/           |_| |_|        |_|            \_____)         |_| \_)           #
#                                                                           19.08.02 #
######################################################################################
*/
var complete_marker_list = {name: {}, lat: {}, long: {}};
var marker_list = {name: {0:0},cant: {0:0}, lat: {0:0}, long: {0:0}};

var valoresObtenidosDelSeller = '';

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

  var username = this.state.text;
  localStorage.setItem('seller',username)

  if (username.length!==0) {
    fetch('http://localhost:8081/sellMap?username='+ username)
    .then((response) => {
      if (response.ok) {
        var valoresSeller = response.json();
        valoresSeller.then(value => {
          console.log(value)
          valoresObtenidosDelSeller = value
          console.log(valoresObtenidosDelSeller)
          this.setState({termino: 'si', userok: 'true'});
          console.log('estado'+JSON.stringify(valoresObtenidosDelSeller))
        })
        
      } else {
        this.setState({userok: 'false', termino: 'si'});
      }
    })
  }
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

    if (this.state.userok === ''){
      var unavariable = <div>...</div>
    }else if(this.state.userok === 'false') {
      unavariable = <div><Alert variant="warning">NO HAY UN USUARIO CON ESE NOMBRE!</Alert></div>
    }else{
      unavariable = <div><Alert variant="success">USUARIO ENCONTRADO CORRECTAMENTE</Alert></div>
    }

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
          {unavariable}
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
