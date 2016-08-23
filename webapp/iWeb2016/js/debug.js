(function(){
    window.gg=window.gg || {};
    window.gg.console={
        opacity:false,//false pointer-events:none true pointer-events:auto
        debug:window.document.querySelector('#gg-debug'),
        area:null,
        init:function(opacity){
            this.opacity=opacity;
            if(!this.debug){
                this.debug=window.document.createElement('div');
                this.debug.id='gg-debug';
                var str='<div id="gg-debug-area" style="position:fixed;left:0;top:0;width:50%;height: 30rem;overflow-y: auto;pointer-events:none;z-index:99999999;padding:1rem 0 0 1rem;color:blue;';
                str+=this.opacity?'pointer-events:auto':'pointer-events:none'+'"></div>';
                this.debug.innerHTML=str;
            }
            window.document.querySelector('body').appendChild(this.debug);
            this.area=this.debug.querySelector('#gg-debug-area');
        },
        log:function(value){
            var log=window.document.createElement('div');
            log.innerHTML=value;
            var first=this.area.firstChild;
            this.area.insertBefore(log,first);
        },
        switchState:function(opacity){
            this.opacity=opacity;
            this.area.style.pointerEvents=opacity?'auto':'none';
        }
    };
    window.gg.console.init();
})();