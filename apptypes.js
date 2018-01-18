class ApplicationTypes {
constructor (){
    this.apptypes=[
            { typeid:148, name:"Call Control Platform", solution: "Genesys Voice Platform"},
            { typeid:59,	name:"Chat Server", solution: "eServices"},
            { typeid:90,	name:"Classification Server", solution: "eServices"},
            { typeid:21,	name:"Configuration Server", solution: "Management Framework"},
            { typeid:64,	name:"E-mail Server", solution: "eServices"},
            { typeid:184,	name:"Genesys Administrator Extension", solution: "Genesys Administrator Extension"},
            { typeid:61,	name:"Genesys Co-browse Server", solution: "Genesys Co-browse"},
            { typeid:55,	name:"Genesys Info Mart", solution: "Genesys Info Mart"},
            { typeid:111,	name:"Interaction Server", solution: "eServices"},
            { typeid:166,	name:"iWD Manager", solution: "intelligent Workload Distribution"},
            { typeid:167,	name:"iWD Runtime Node", solution: "intelligent Workload Distribution"},
            { typeid:100,	name:"Knowledge Manager", solution: "eServices"},
            { typeid:145,	name:"Media Control Platform", solution: "Genesys Media Server"},
            { typeid:42,	name:"Message Server", solution: "Management Framework"},
            { typeid:173,	name:"MRCP Proxy", solution: "Genesys Voice Platform"},
            { typeid:153,	name:"Reporting Server", solution: "Genesys Media Server"},
            { typeid:149,	name:"Resource Manager", solution: "Genesys Media Server"},
            { typeid:62,	name:"SMS Server", solution: "eServices"},
            { typeid:45, name:"SNMP Master Agent", solution: "Management Framework"},
            { typeid:171,	name:"Social Messaging Server", solution: "eServices"},
            { typeid:43,	name:"Solution Control Server", solution: "Management Framework"},
            { typeid:2,	name:"Stat Server", solution: "Stat Server"},
            { typeid:154,	name:"Supplementary Services Gateway", solution: "Genesys Voice Platform"},
            { typeid:91,	name:"Training Server", solution: "eServices"},
            { typeid:63,	name:"Universal Contact Server", solution: "eServices"},
            { typeid:71,	name:"Universal Contact Server Manager", solution: "eServices"},
            { typeid:80,	name:"Web API Server", solution: "eServices"}
            ];
        }

    findByTypeID(id){
        var applications=this.apptypes;
        for (var i=0;i<applications.length;i++){
            if (id===applications[i].typeid)
            return applications[i];
        }
        return null;

    }

    findByName(name){
        var applications=this.apptypes;
        for (var i=0;i<applications.length;i++){
            if (name===applications[i].name)
            return applications[i];
        }
        return null;
    }

    findBySolution(name){
        var applications=this.apptypes;
        var arr=[];
        for (var i=0;i<applications.length;i++){
            if (name===applications[i].solution)
            arr.push(applications[i]);
        }
        return arr;
    }

}

module.exports=ApplicationTypes;