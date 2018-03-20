import './monitor-includes.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';

const htmlTemplate = `
                <style>
                    paper-icon-button { --iron-icon-fill-color:white;}
                    .stopped { background-color:var(--stop-color, red)}
                    .started { background-color:var(--start-color, green)}
                </style>
                <script type="text/javascript" src="/canvasjs.min.js"></script> 
                <paper-card class="flex" style="min-width:750px;width:98%">
                    <div class="card-content">
                         <div style="display:flex">
                              <img src="/images/cam.jpg" />
                               <slot></slot>
                         </div>
                    </div>
                    <div class="card-actions" class$="{{_statusClass(Running)}}">
                        <div class="horizontal" style="display:flex;align-items:center;">
                         <paper-button id="btnStartStop" on-tap="toggle">{{label}}</paper-button> 
                          <paper-input label="command line options:" value="{{startupoptions}}" hidden$="{{Running}}"></paper-input>
                           <paper-icon-button id="btnInfo" hidden$="{{Running}}" on-tap="showInfo" icon="info"></paper-icon-button> 
                         <paper-button id="btnReference" hidden$="{{!Running}}" on-tap="showReferenceFrame">Show Reference Frame</paper-button> 
                         <paper-button id="btnCrop" hidden$="{{!Running}}" on-tap="showCrop">Set Crop Frame</paper-button> 
                         <paper-button id="btnSnap" hidden$="{{!Running}}" on-tap="showSnapshotFrame">Show Snapshot Frame</paper-button> 
                         </div>
                    </div>
                </paper-card>
            <paper-dialog id="modalcrop" modal>
            <img id="full" src="/full.jpg" >
            <canvas id="overlay" style="position:absolute;left:-0px;top:-20px;border:0px solid red;" on-mousedown="md" on-mouseup="mu" on-mousemove="mo"></canvas>
            </paper-dialog>
            <paper-dialog id="modalref" modal>
            <img id="referenceframe" src="/ref.jpg" style="height:400px;width:450px">
            <div class="buttons">
                <paper-button dialog-confirm autofocus>Tap me to close</paper-button>
            </div>
            </paper-dialog>  
             <paper-dialog id="modalsnap" modal>
            <img id="snapshotframe" src="/snapshot.jpg" style="height:400px;width:600px">
            <div class="buttons">
                <paper-button dialog-confirm autofocus>Tap me to close</paper-button>
            </div>
            </paper-dialog>  
            <paper-dialog id="modalinfo" modal>
                <h2>Information</h2>
                <div>
                The following command line options are available:
                <br/>
                <table>
                    <tr><th>function</th><th>description</th><th>command line option</th></tr>
                    <tr><td>Cropping</td><td>This option sets the FOV for monitoring<td>-c x,y,w,h</td></tr>
                    <tr><td>Brightness</td><td>This option filters out extreem light and dark frames</td><td>-f min%-max%</td></tr>
                    <tr><td>Thresholding</td><td>This option sets the size of personcontours</td><td>-t minw,minh,maxw,maxh</td></tr>
                    <tr><td>Snapshotting</td><td>This option generates snapshots of each frame to inspect</td><td>-s</td></tr>
                </table>
                <br/>
                You might consider setting snapshotting off when monitoring, just use it as calibration tool.
               </div>
            <div class="buttons">
                <paper-button dialog-confirm autofocus>Tap me to close</paper-button>
            </div>
            </paper-dialog> 
`;

export class MonitorDasboard extends PolymerElement {
    static get template() {
        return htmlTemplate;
    }
    static get properties() {
        return {
            properties:{
                data:{
                    type:Object, 
                    value:{},
                    observer:'processData'
                },
                drawrect:{
                    type:Boolean,
                    value:false,
                },
                Running:{
                    type:Boolean,
                    value:false,
                    observer:'updateLabel',
                    notify:true
                },
                command:{
                    type:String,
                    value:"",
                    notify:true
                }
            },
        };
    }
    connectedCallback(){
        super.connectedCallback();
        window.setTimeout(()=>{
            this.$.chart = new CanvasJS.Chart("chart", { 
                title:{text:"Visual characteristics"},
                legend: {
                    cursor: "pointer",
                    itemclick: function (e) {
                        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                            e.dataSeries.visible = false;
                        } else {
                            e.dataSeries.visible = true;
                        }
                        e.chart.render();
                    }
                },
                panEnabled:true,
                zoomEnabled: true,
                data:[
                    {showInLegend:true,legendText:'Hoeken',type:"spline",dataPoints:[{y:10}]},
                    {showInLegend:true,legendText:'Contoeren',type:"spline",dataPoints:[{y:10}]},
                    {showInLegend:true,legendText:'Afwijking',type:"spline",dataPoints:[{y:10}]},
                    {showInLegend:true,legendText:'Voorgrond',type:"spline",dataPoints:[{y:10}]},
                    {showInLegend:true,legendText:'Beweging',type:"spline",dataPoints:[{y:10}]},
                    {showInLegend:true,legendText:'Helderheid',type:"spline",dataPoints:[{y:10}]},
                    {showInLegend:true,legendText:'Objecten',type:"spline",dataPoints:[{y:10}]}
                ]
            });
            this.$.chart.render();
        },0);
    }

    toggle(){
        this.command = this.Running ? {command: "stopcam"}:{command: "startcam", arguments:this.startupoptions};
        this.icon = this.Running ? "av:fiber-manual-record": "av:stop";
    }
    processData(){
            this.clientid = this.data.clientid;
                // var chartdata = this.status.data.toString().split(",");
                // if (chartdata.length == 7){
                //     for (var l in chartdata) {
                //         var val = chartdata[l].split(":")[1];
                //         this.$.chart.options.data[l].dataPoints.push({ y: parseInt(val)});
                //     }
                //     if (this.$.chart.axisX.length > 0){
                //         this.$.chart.options.axisX = { };
                //         this.$.chart.options.axisX.minimum = Math.max(this.$.chart.axisX[0].maximum-500,0);
                //     }
                //     this.$.chart.render();
                // }
           // }
    }
    updateLabel(){
        this.label = this.Running ? "stop": "start";
    }
    _statusClass(){
        return this.Running ? "started": "stopped";
    }
    showCrop(){
        this.$.full.src = "./full.jpg?" + Date.now();
        this.async(()=>{
                this.$.modalcrop.open();
                setTimeout(()=>{
                this.$.overlay.width = this.$.full.width;
                this.$.overlay.height = this.$.full.height;
                }, 10);
        });
    }
    showReferenceFrame(){
        this.$.referenceframe.src = "./ref.jpg?" + Date.now();
        this.async(()=>{
                this.$.modalref.open();
        });
    }
    showSnapshotFrame(){
        this.$.snapshotframe.src = "./snapshot.jpg?" + Date.now();
        this.async(()=>{
                this.$.modalsnap.open();
        });
    }
    showInfo(){
        this.async(()=>{
                this.$.modalinfo.open();
        });
    }
    md() { 
        this.drawrect = true;
        this.drawrectorigin = { x: event.offsetX, y: event.offsetY }
    }
    mo() {
        if (this.drawrect) {
            var ctx = this.$.overlay.getContext('2d');
            ctx.clearRect(0, 0, this.$.overlay.width, this.$.overlay.height);
            this.crop =  { x: this.drawrectorigin.x, y: this.drawrectorigin.y, width: window.event.offsetX - this.drawrectorigin.x, height:window.event.offsetY - this.drawrectorigin.y};
            ctx.beginPath();
            ctx.lineWidth=4;
            ctx.rect(this.crop.x, this.crop.y, this.crop.width, this.crop.height);
            ctx.closePath();
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();
            this.startupoptions = "-c " + this.crop.x + "," + this.crop.y + "," + this.crop.width+ "," + this.crop.height;
        }
    }
    mu(){
        this.drawrect = false;
        var ctx = overlay.getContext('2d');
        window.setTimeout(() => {
            ctx.clearRect(0, 0, 640, 480);
            this.$.modalcrop.close();
            this.toggle();
            }, 100);
    }
}

customElements.define('monitor-graph', MonitorDasboard);
