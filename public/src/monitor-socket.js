import './monitor-includes.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';

const htmlTemplate = ``;

export class MonitorSocket extends PolymerElement {
    static get template(){
        return htmlTemplate;
    }

    static get properties() {
        return {
            auto:{ type:Boolean, value:false },
            lastResponse:{ type:Object, value:{}, notify:true }
        }
    }
    connectedCallback(){
        super.connectedCallback();
        console.log('starting this component');
        this.socket = io();
        if (this.auto) this._startListening();
    }

    _startListening(){
        this.socket.on('response', (msg) => {
            console.log('data received' + msg);
            this.lastResponse = JSON.parse(msg);
        });
    }

    send(message, payload){
        this.socket.emit(message, payload);
    }
}

customElements.define('monitor-source', MonitorSocket);