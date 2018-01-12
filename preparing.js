'use strict';

var processed_obj = function (res, obj) {
  var component = {};
  res.rows.forEach(function (val) {
    var key = val.key;
    var value = val.value;
    var index = obj.components.length,
      doc = value,

      component_name = key[0],
      release_version = key[1],
      issue = (typeof doc.bugfixes == 'string') ? doc.bugfixes : undefined,
      feature = (typeof doc.features == 'string') ? doc.features : undefined;

    var release_info = {
      family: doc.family,
      date: doc.release_date,
      release_type: doc.release_type,
      restricted: (doc.restricted == 'yes') ? true : false,
      aix: (doc.aix == 'X') ? true : false,
      linux: (doc.linux == 'X') ? true : false,
      solaris: (doc.solaris == 'X') ? true : false,
      windows: (doc.windows == 'X') ? true : false,
      release: release_version
    };

    //var current_release=current;

    //var latest_release=fill_latest_release();

    //console.log('%s: %s %s %s', component_name, release_version,feature);

    // find component in obj
    component = findComponent(obj, component_name);
    //if (component.current_release==undefined) component.current_release=current_release;

    var release = findRelease(component, release_info);
    // if (component.latest_release==undefined) component=add_latest_release(component);
    //if (component.delta_same_family==undefined)component.delta_same_family=delta_same_family;
    //if (component.delta_latest_release==undefined)component.delta_latest_release=delta_latest_release;
    add_to_embedded_array(release, 'features', feature);
    add_to_embedded_array(release, 'issues', issue);


    console.log("added " + component_name + " feature of release " + release_version);
  });

  component = add_latest_release(component);
  return obj;

};

var nest = function (obj, keys, v) {
  if (keys.length === 1) {
    obj[keys[0]] = v;
  } else {
    var key = keys.shift();
    obj[key] = nest(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
  }

  return obj;
};

var findComponent = function (obj, component_name) {


  if (typeof (obj.components) === 'undefined') obj.components = [];

  if (obj.components.length > 0) {
    var index = 0;

    index = obj.components.findIndex(value => value.component === component_name);
    if (index == -1) {// no elements found in array, adding a new one
      index = obj.components.length;
      obj.components[index] = { component: component_name };
    };

    return obj.components[index];
  } else {
    return obj.components[0] = { component: component_name };
  };
};


/*
Function to find release 

*/
var findRelease = function (obj, release_info) {

  /*
   Function to create object by copying properties of another object 
  */
  var fill_data = function (obj, struct) {
    //console.log(typeof obj);

    const propNames = Object.getOwnPropertyNames(struct);
    propNames.forEach(function (name) {
      const desc = Object.getOwnPropertyDescriptor(struct, name);
      Object.defineProperty(obj, name, desc);
    });
    return obj;
  };


  if (typeof (obj.releases) === 'undefined') obj.releases = [];

  if (obj.releases.length > 0) {
    var index = 0;
    index = obj.releases.findIndex(value => value.release === release_info.release);
    console.log('index found for release ' + release_info.release + ' at ' + index);
    if (index == -1) {// no elements found in array, adding a new one
      index = obj.releases.length;

      return fill_data(obj.releases[index] = {}, release_info);
    };

    return obj.releases[index];

  } else {
    return fill_data(obj.releases[0] = {}, release_info);
  };
};





/*
function to update the object with latest release info
return Promise to be used in conjunction with async/await (for synchronious processing)

obj should be one of elements of {components:[
  {
    component:name,
    releases:[],
    current_release:{},
    delta_same_family: Int,
    latest_release:{},
    delta_latest_release:Int
  }
]}
*/
var add_latest_release = function (obj) {

  var index = obj.releases.length - 1;

  obj.latest_release = {
    release: obj.releases[index].release,
    family: obj.releases[index].family,
    date: obj.releases[index].date,
    release_type: obj.releases[index].release_type
  };
  return obj;
};

var add_latest_release_same_family = function (obj) {

  var index = obj.releases.length - 1;

  obj.latest_release = {
    release: obj.releases[index].release,
    family: obj.releases[index].family,
    date: obj.releases[index].date,
    release_type: obj.releases[index].release_type
  };
  return obj;
};
/*
obj should be one of elements of {components:[
  {
    component:name,
    releases:[],
    current_release:{},
    delta_same_family: Int,
    latest_release:{},
    delta_latest_release:Int
  }
]}

add_current_release(obj.components[1], release);
*/

var add_current_release = function (obj, release) {
  return {}

}


/*
obj - data structure with any internal array
var obj={internal_array:[]}
key - name of array to refer like obj[key]
text - the string that needs to be inserted into obj[key]
*/

var add_to_embedded_array = function (obj, key, text) {
  new Promise(resolve => {
    if (typeof (obj[key]) === 'undefined') obj[key] = [];

    var res = (text == null) ? -1 : obj[key].push(text);

    console.log("added release " + obj.release + " " + key + " to position " + res);
    resolve(res);
  });
}

var query = function (view, opts) {
  var obj = db.view(view, opts, function (err, res) {
    console.log('Getting data from ' + view + ' with options ' + opts);
    if (err) console.log(err);
    return res;
  });
};

//  var obj={components:[]};
var obj1 = {
  components: [
    {
      component: 'Interaction Server',
      releases: [
        {
          release: '2222',
          family: '9',
          date: '12/12/87',
          release_type: 'General',
          restricted: true,
          aix: true,
          linux: false,
          solaris: false,
          windows: true,
          features: [
            "Abracadabra",
            "sim salabim"
          ],
          issues: [
            "It's all bad",
            "this one is even worse"
          ]
        }
      ],
      current_release: {
        release: '2222',
        family: '9',
        date: '12/12/87',
        release_type: 'General'
      },
      latest_same_family: {
        release: '2222',
        family: '9',
        date: '12/12/87',
        release_type: 'General'
      },
      delta_same_family: 1,
      latest_release: {
        release: '2222',
        family: '9',
        date: '12/12/87',
        release_type: 'General'
      },
      delta_latest_release: 20
    }
  ]
};

module.exports = {
  processed_obj,
  findComponent
};