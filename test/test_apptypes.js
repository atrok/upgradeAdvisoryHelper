var ApplicationTypes=require('../apptypes');

var apptype=new ApplicationTypes();

var val=apptype.findByTypeID(148);

console.assert("Call Control Platform"===val.name,"Failed findByTypeID %", val);

var val=apptype.findByTypeID(0);
console.assert(null===val,"Failed findByTypeID with id=0 %", val);

var val=apptype.findByTypeID(-1);
console.assert(null===val,"Failed findByTypeID with id=-1 %", val);

var val=apptype.findByName('Media Control Platform');
console.assert(145===val.typeid,"Failed findByName with name=Media Control Platform", val);

var val=apptype.findByName('Media Control');
console.assert(null===val ,"Failed findByName with name=Media Control (expected val==NULL)", val);

var val=apptype.findByName(145);
console.assert(null===val ,"Failed findByName with name=145 (expected val==NULL)", val);

var val=apptype.findBySolution('eServices');
console.assert(val instanceof (Array) ,"Failed findBySolution (Array is expected)", val);
console.assert(val instanceof (Array)&&val.length==11 ,"Failed findBySolution (Array is expected of length 11)", val);

var val=apptype.findBySolution('EService');
console.assert(val instanceof (Array) ,"Failed findBySolution (Array is expected)", val);
console.assert(val instanceof (Array)&&val.length==0 ,"Failed findBySolution (Array is expected of length 0)", val);