'use strict';
var http=require('http');

const StringBuilder=require('./stringbuilder');

class Logger{
    
    constructor(response) {
        this.response=this.assignServerResponse(response);
        this.sb=new StringBuilder();
    };

    

    log(str){
        var processed=this.toString(str);

        console.log(processed);

        if(typeof this.response!=='undefined') 
           this.response.write(processed.replace('\t', '&nbsp;').replace('\n', '<br/>')+'<br/>');
        this.sb.flush();
   
   };
   

   toString(str){
       return (typeof str==="string") ? str : this.processObject(str, this.sb,1).toString();
   }

   processObject(opts,stringbuilder, cycle){

      var propNames=(typeof opts!=='undefined')?Object.getOwnPropertyNames(opts):{object:undefined};
      var sb=stringbuilder;
      sb.append('\n\t'.repeat(cycle-1)+"{\n");
      for(var i=0; i<propNames.length; i++){
        const desc = Object.getOwnPropertyDescriptor(opts, propNames[i]);
        //var value=Object.getOwnPropertyDescriptor(opts,property);
        sb.append('\t'.repeat(cycle)+propNames[i]+':');
        if (typeof desc.value==='object') {
          sb=this.processObject(desc.value, sb,++cycle);
          --cycle;
        }
        else
          sb.append(desc.value+'\n');
       };
       
      return sb.append('\t'.repeat(--cycle)+'}\n');
  };

   assignServerResponse(response){
    if(typeof(response)==='undefined'||response===null){
        return  undefined;
    }

    if(Object.getPrototypeOf(response) === http.ServerResponse.prototype){
       return response;
    }else throw new TypeError('http.ServerResponse is expected');
   }

}



module.exports=Logger;