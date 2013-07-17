
var Bayes={};
(function(Bayes) {
  //--
  Bayes.nodes=[];
  Bayes.Node=function(n,v) {
    //if (arguments.length==3) this.set3(arguments[0],arguments[1],arguments[2]);
    this.name=n;
    this.values=v;
    this.value=-1;
    this.parents=[];
  }
  Bayes.Node.prototype.initSampleLw=function() {
    //alert('initSampleLw '+this.name);
    this.sampledLw=undefined;
  }
  Bayes.Node.prototype.sampleLw=function() {
    if (this.wasSampled) return 1;
    var fa=1;
    for (var h=0;h<this.parents.length;h++) 
      fa*=this.parents[h].sampleLw();
      
    //---dist.sampleLw
    this.wasSampled=true;
    var dh=this.cpt;
    for (var h=0;h<this.parents.length;h++) dh=dh[this.parents[h].value];
    
    if (this.value!=-1) 
      fa*=dh[this.value];
    else {
      var fv=Math.random();
      for (var h=0;h<dh.length;h++) {
        fv-=dh[h];
        if (fv<0) { this.value=h;break; }
      }
    }
    
    return fa;
  }
  Bayes.Node.prototype.saveSampleLw=function(f) {
    if (!this.sampledLw) {
      this.sampledLw=new Array(this.values.length);
      for (var h=this.values.length-1;h>=0;h--) this.sampledLw[h]=0;
    }
    this.sampledLw[this.value]+=f;
  }
  
  Bayes.sample=function(samples) {
    //alert('bayes.sample '+samples);
    for (var h=Bayes.nodes.length-1;h>=0;h--) Bayes.nodes[h].initSampleLw();
    
    var lwSum=0;
    for (var count=0;count<samples;count++) {
      for (var h=Bayes.nodes.length-1;h>=0;h--) {
        var n=Bayes.nodes[h];
        if (!n.isObserved) n.value=-1;
        n.wasSampled=false;
      }
      
      var fa=1;
      for (var h=Bayes.nodes.length-1;h>=0;h--) {
        var n=Bayes.nodes[h];
        fa*=n.sampleLw();
      }
      lwSum+=fa;
      for (var h=Bayes.nodes.length-1;h>=0;h--) {
        var n=Bayes.nodes[h];
        n.saveSampleLw(fa);
      }  
    }
    return lwSum;
  }
  //---
}
)(Bayes);


//fr o,2
//fr o,2,4
//fr o,2,5
//fr o,2,7
//fr p,2,19
