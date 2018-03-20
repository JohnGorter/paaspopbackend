import './monitor-includes.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js';

const htmlTemplate = `
    <style>
    .active { background-color:green};
    .inactive { background-color:red};
    .item_container { display:flex;justify-items:space-between;width:300px;padding:15px;margin:15px;position:absolute;margin-top:80px; }
    .item { display:flex;justify-items:space-between;padding:10px;margin:10px;cursor:pointer; }
    .item img { height:20px;margin-right:10px;}
    </style>
    <div class="item_container">
    <template is="dom-repeat" items="[[items]]">
        <div on-tap="_click" class$="item {{_getClass(item.lastseen, timer)}}">
            <img src="[[_getIcon(item.imageurl)]]"></img>
            <div class="details"> [[item.clientid]] </div>
        </div>
    </template>
    </div>
`;

export class MonitorList extends GestureEventListeners(PolymerElement) {
    static get template() {
        return htmlTemplate;
    }
    static get properties() {
        return {
            unknowndeviceIconUrl: {
                type:String,
                value:'/images/unknown-device.png',
            },
            timer:{
                type:Number,
                value:0
            },
            items: {
                type:Array,
                value:[]
            }
        }
    }

    connectedCallback() {
        super.connectedCallback(); 
        setInterval(() => {
            this.timer += 1;
            if (this.timer > 10000) this.timer = 0;
        }, 1000);
    }
    _getIcon(url){
        return url || this.unknowndeviceIconUrl;
    }
    _getClass(lastseen) {
        return new Date() - Date.parse(lastseen) < 5000 ? "active" : "inactive";
    }
    _click(e){
        this.dispatchEvent(new CustomEvent("device-clicked", { detail:e.model.item }), { composed:true, bubbles:true});
    }
}

customElements.define('monitor-list', MonitorList);