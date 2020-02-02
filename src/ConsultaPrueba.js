import React, {Component} from 'react';
import Toggle from './Toggle';
import {db} from './firebase';
import {refOkr, refOkrRc} from './firebase/db';
import firebase from './firebase/firebase';
import 'firebase/database';
import './ConsultaPrueba.css';
//import {Modal} from 'react-bootstrap/Modal';
import {ProgressBar, Button} from 'react-bootstrap';
//import { thisExpression } from '@babel/types';
require ('firebase/database');

//var firebase = require('firebase/app');
//import { isEmptyStatement } from '@babel/types';
//import ConsultaUsuario from './ConsultaUsuario';
//import firebase from 'firebase/database';

/*const INITIAL_STATE = {
    id: '',
    nombre: '',
    descripcion: '',
    equipo: '',
    prioridad: '',
    tipo: '',
    progreso: '',
    rc: '',
    error: null,
    newProgress: '',
    on: false
}*/



/*const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value
});*/

//const newState = [];
/*{
    Object.keys(rcs).map( key =>
         <p>{rcs[key].nombre}</p>
    )
}*/

class ConsultaPrueba extends Component{
    constructor(props){
        super(props);

        /*(this.state = {
            INITIAL_STATE
        };*/

        this.removeOkr = this.removeOkr.bind(this);
        //this.removeRc = this.removeRc.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        //this.muestra = this.muestra.bind(this);
    }
    /*muestra = () => {
        this.setState({
            on: !this.state.on
        });
    }*/


    componentDidMount(){
        refOkr.on('value', (snapshot) =>{
            const items = snapshot.val();
            const newState = [];
            for(const item in items){
                newState.push({
                    id: item,
                    nombre: items[item].nombre,
                    descripcion: items[item].descripcion,
                    equipo: items[item].equipo,
                    prioridad: items[item].prioridad,
                    tipo: items[item].tipo,
                    progreso: items[item].progreso,
                    rc: items[item].rc
                });
            }
            this.setState({
                items: newState
            });
            console.log("Datos de prueba de Okr con Rc anidados");
            console.log("----------------------------------")
            console.log(items);
        });

    }

    /*enviaUpdate = (event) => (idokr, idrc, progreso) => {
        firebase.database().ref(`okr/${idokr}/rc/${idrc}`).set({
            actual: progreso
        });*/

    

    removeOkr(uuid){
        console.log("Eliminando OKR");
        const elimina_Okr = firebase.database().ref(`okr/${uuid}`);
        elimina_Okr.remove();
        console.log("OKR eliminado");
    }

    enviarId = (id) =>{
        firebase.database().ref(`okr/${id}/rc`).on('value', snapshot =>{
            const rcs = snapshot.val();
            const estado = [];
            for(const rc in rcs){
                estado.push({
                    nombre: rcs[rc].nombre,
                    inicial: rcs[rc].inicial,
                    actual: rcs[rc].actual,
                    esperado: rcs[rc].esperado,
                    target: rcs[rc].target,
                    inicio: rcs[rc].inicio,
                    termino: rcs[rc].termino
                });
            }
            this.setState({
                rcs: estado
            });
            console.log("---------------DATOS RC's----------------");
            console.log(estado);
        });

        firebase.database().ref(`okr/${id}/iniciativas`).on('value', snapshot =>{
            const iniciativas = snapshot.val();
            const estado2 = [];
            for(const iniciativa in iniciativas){
                estado2.push({
                    id: iniciativa,
                    nombre: iniciativas[iniciativa].nombre,
                    equipo: iniciativas[iniciativa].equipo,
                    progreso: iniciativas[iniciativa].progreso
                });
            }
            this.setState({
                iniciativas: estado2
            });
            console.log("---------INICIATIVAS------------");
            console.log(estado2);
        });
    }

    render(){

        //const datosOkr = this.state.datosOkr ? this.state.datosOkr : {}
        //const rcs = this.state.rcs ? this.state.rcs: null
        /*const{
            newProgress
        } = this.state;*/
        return(
            <div className="cuerpo">
                <section>
                    <h2>Consulta OKR</h2>
                    <div className="Wrapper">
                        {this.state.items && this.state.items.map((item, key) => {
                            return(
                                <div>
                                    <a onClick={() => this.enviarId(item.id)}>
                                    <div className="okr">                                    
                                        <span><b>{item.nombre}</b></span>
                                        <span>{item.equipo}</span>
                                        <span>{item.prioridad}</span>
                                        <span className="barra"><ProgressBar animated now={item.progreso} max="100" min="0" /></span>
                                        <Toggle><div>{this.state.rcs && this.state.rcs.map((rc) =>{
                                            return(
                                                <div className="rc">
                                                    <span>{rc.nombre}</span>
                                                    <span><ProgressBar min="0" max="100" now={rc.actual} /></span>
                                                    </div>
                                            );
                                        })}
                                        </div></Toggle>
                                        <Toggle onClick={() => this.enviarId(item.id)}><div className="rc">
                                            {this.state.iniciativas && this.state.iniciativas.map((dato) => {
                                                return(
                                                    <div>
                                                        <span>{dato.nombre}</span>
                                                        <span>{dato.equipo}</span>
                                                        <span><ProgressBar animated now={dato.progreso} min="0"  max="100" /></span>
                                                        </div>
                                                );
                                            })}
                                        </div></Toggle>
                                    </div></a>

                                </div>
                            );
                        })}
                    </div>
                </section>
                <br />
                <br />
                
            </div>
            
        );
    }
}


export default ConsultaPrueba;