
// JavaScript Document
Chart.Interface.Mapping =function(){};
Chart.Interface.Mapping.prototype = {

    setValueRange: function(json){
        return null;
    },
    
    setCoordinateRange: function(json){
        return null;
    },
    
    getValueRange: function(){
        return null;
    },
    
    getCoordinateRange: function(){
        return null;
    },
    
    getCoordinate: function(pt){
        return null;
    },
    
    getValue: function(pt){
        return null;
    }
    
}
Chart.Common.Util.Double2DoubleLinearMapping = function(){
    this._pointer = new Chart.Common.Coordinate.Double2DoubleLinearMapping();    
}
Chart.Common.Util.Double2DoubleLinearMapping.prototype = $.extend(true,{},new Chart.Interface.Mapping(), {

    setValueRange: function(json){
        return this._pointer.setValueRange(json);
    },
    
    setCoordinateRange: function(json){
        return this._pointer.setCoordinateRange(json);
    },
    
    getValueRange: function(){
        return this._pointer.getValueRange();
    },
    
    getCoordinateRange: function(){
        return this._pointer.getCoordinateRange();
    },
    
    getCoordinate: function(pt){
        return this._pointer.getCoordinate(pt);
    },
    
    getValue: function(pt){
        return this._pointer.getValue(pt);
    }
    
});


Chart.Common.Util.Double2DoubleLogMapping = function(){

    this._pointer = new Chart.Common.Coordinate.Double2DoubleLogMapping();
    
}
Chart.Common.Util.Double2DoubleLogMapping.prototype = $.extend(true,{},new Chart.Interface.Mapping(),{

    setValueRange: function(json){
        return this._pointer.setValueRange(json);
    },
    
    setCoordinateRange: function(json){
        return this._pointer.setCoordinateRange(json);
    },
    
    getValueRange: function(){
        return this._pointer.getValueRange();
    },
    
    getCoordinateRange: function(){
        return this._pointer.getCoordinateRange();
    },
    
    getCoordinate: function(pt){
        return this._pointer.getCoordinate(pt);
    },
    
    getValue: function(pt){
        return this._pointer.getValue(pt);
    }
    
});

Chart.Common.Util.Date2DoubleLinearMapping = function(){

    this._pointer = new Chart.Common.Coordinate.Date2DoubleLinearMapping();
}
Chart.Common.Util.Date2DoubleLinearMapping.prototype = $.extend(true,{},new Chart.Interface.Mapping(), {

    setValueRange: function(json){
        return this._pointer.setValueRange(json);
    },
    
    setCoordinateRange: function(json){
        return this._pointer.setCoordinateRange(json);
    },
    
    getValueRange: function(){
        return this._pointer.getValueRange();
    },
    
    getCoordinateRange: function(){
        return this._pointer.getCoordinateRange();
    },
    
    getCoordinate: function(pt){
        return this._pointer.getCoordinate(pt);
    },
    
    getValue: function(pt){
        return this._pointer.getDate(pt);
    }
    
});

Chart.Common.Util.ScatterValueMapping = function(){
    this._pointer = new Chart.Common.Coordinate.ScatterValueMapping();
}
Chart.Common.Util.ScatterValueMapping.prototype = $.extend(true,{},new Chart.Interface.Mapping(), {

    setValueRange: function(json){
        return this._pointer.setValueRange(json);
    },
    
    setCoordinateRange: function(json){
        return this._pointer.setCoordinateRange(json);
    },
    
    getValueRange: function(){
        return this._pointer.getValueRange();
    },
    
    getCoordinateRange: function(){
        return this._pointer.getCoordinateRange();
    },
    
    getCoordinate: function(pt){
        return this._pointer.getCoordinate(pt);
    },
    
    getValue: function(pt){
        return this._pointer.getValue(pt);
    }
    
});



















