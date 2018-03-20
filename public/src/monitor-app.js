
import './monitor-includes.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';

const htmlTemplate = `
    <style>
    app-header { position:fixed;position: fixed; z-index:99;top: 0; left: 0; width: 100%; height: 100px;}
    app-toolbar { background-color:var(--main-background-color);height:70px;margin:0px;}
    app-toolbar paper-icon-button  { color:var(--main-color); }
    app-toolbar paper-input  { --paper-input-container-input-color:var(--main-color); }
    app-toolbar *[main-title] { color:var(--main-color);font-family:"pn","Helvetica Neue",Helvetica,Arial,sans-serif}
    app-toolbar img { height:75px;position:relative;top:5px;padding-right:20px; }
    #monitor { border:0px solid black;width:100vw;height:50vh;position:fixed;bottom:0px;}
    .content { margin-top:0px;background-color:#ccc;height:50vh;width:100vw;position:absolute;}
    </style>
    <div class="layout vertical flex">
    <app-header fixed>
        <app-toolbar sticky>
            <img src="/images/logo.png"></img>
            <template is="dom-if" if="{{editmode}}">
                <paper-input value="{{camname}}" on-change="toggleMode"></paper-input>
            </template> 
            <template is="dom-if" if="{{!editmode}}">
                <div main-title> {{ camname }} </div>
            </template>
            <paper-icon-button icon="create" on-tap="toggleMode"></paper-icon-button>
        </app-toolbar>
    </app-header>
    <div class="content">
        <monitor-list items="{{devices}}" on-device-clicked="addIFrame"></monitor-list>
    </div>
    <iframe id="monitor"></iframe>
    <monitor-source id="datasource" auto last-response="{{data}}"></monitor-source>
    </div>
`;

export class MonitorApp extends PolymerElement {
    static get template() {
        return htmlTemplate;
    }
    static get properties() { 
        return {
            devices:{
                type:Array, 
                value:[]
            },
            camname:{
                type:String, 
                value:'CAM 01'
            },
            editmode: {
                type:Boolean,
                value:false
            }
        };
    }

    static get observers() { 
        return ["sendCommand(command)", "addDevice(data)"];
    }
    addDevice(data){
        if (data.clientid){
            let d = this.devices.find((f) => f.clientid == data.clientid);
            if (d){
                d.lastseen = new Date().toISOString();
                this.notifyPath("devices." + this.devices.indexOf(d) + ".lastseen");
            }
            else {
                data.lastseen = new Date().toISOString();
                this.push('devices', data);
            }
        } else {
            console.warn("unknown dump", data);
        }
    }

    toggleMode() {
        this.editmode = !this.editmode;
    }
    sendCommand(command){
        if (command) this.$.datasource.send("command", this.command);
    }

    addIFrame(e){
        console.log("event", e); 
        this.$.monitor.src = e.detail.url;
    }
}

customElements.define('monitor-app', MonitorApp);