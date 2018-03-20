import './monitor-includes.js';

const divElement = document.createElement("div"); 
divElement.hidden = true; 
divElement.innerHTML = `
<custom-style>
    <style>
    :root { 
        --main-background-color: #282828;
        --main-color: #ddd;
    }
    </style>
</custom-style>
`;

document.body.appendChild(divElement); 