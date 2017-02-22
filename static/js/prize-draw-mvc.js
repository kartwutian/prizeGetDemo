$(function(){
  
    
  

  // controll
  var getPrize = {

    
    start: function(){
      
      this.view.initRollUp()
      this.model.initRootPx()
      this.initLightsPositonControl()
      this.view.start()
    },
    initLightsPositonControl: function(){
      this.model.initlightsPositionControl(this.view.lightsLengthGet())
    },
    ifHaveTimes: function(){
      if(getPrize.model.times){
        getPrize.view.run()
      }else{
        getPrize.view.sorry()
      }
    }
  }

  getPrize.model = {
    rootPx: null,
    prizeList: [ '20爱豆','200爱豆','10爱豆','50爱豆','20爱豆','50爱豆','100爱豆','10爱豆'],
    runNumbers: [ 45 , 46 , 47 , 48 , 49 , 50 , 51 , 52 ],

    lightsPositionControl:[],

    times: 3,
    initRootPx: function(){

      this.rootPx = getPrize.view.getRootPx()
      // console.log(this.rootPx)
    },
    initlightsPositionControl: function(len){
      var a = parseInt(len/20);
      var newLen = a*20+40;
      this.lightsPositionControl[0] = -parseInt((newLen-len)/2+5);
      this.lightsPositionControl[1] = newLen;
    },
    useOneTime: function(){
      if(this.times){
        this.times-- 
        this.oneTimeUsed()
        return this.times
      }
      
    },
    oneTimeUsed: function(){
      getPrize.view.showRemainTimes()
    },
    runNumber: function(){
      return this.runNumbers[parseInt(Math.random()*9)]
    } 
  }

  getPrize.view = {
    start: function(){
      // 移除loading，显示页面
      $('.before-loaded').remove()
      $('.bhz-mod-content').show()
      

      this.initPrizeList()
      this.showRemainTimes()
      this.initLights(getPrize.model.lightsPositionControl[0],getPrize.model.lightsPositionControl[0],getPrize.model.lightsPositionControl[1])
      $("#start-btn").click(this.ifRun);
    },
    initPrizeList: function(){
      for(var i = 0; i <getPrize.model.prizeList.length; i++ ){
        $("#item-"+ (i+1) +" .prize").html(getPrize.model.prizeList[i])
      }
    },
    getRootPx: function(){
      return parseFloat($(document.documentElement).css("font-size"));
    },
    lightsLengthGet: function(){
      // console.log(getPrize.model.rootPx)
      var ulWitdthRem = 3.75*0.6;  // 设置抽奖区域宽度
      var ulWitdth = getPrize.model.rootPx*ulWitdthRem; //rem 转为 px

      return ulWitdth
    },
    initLights: function(startX,startY,len){
      var lights ='';

      for(var i = 0; i <= len/20; i++){
        var k = i%3;
        lights += '<div class="light color-'+k+'" style="top: '+startY+'px; left: '+(startX+20*i)+'px"></div>'; 
        lights += '<div class="light color-'+k+'" style="left: '+startX+'px; top: '+(startY+20*i)+'px"></div>';
        lights += '<div class="light color-'+k+'" style="left: '+(startX+len)+'px; top: '+(startY+20*i)+'px"></div>';
        lights += '<div class="light color-'+k+'" style="top: '+(startY+len)+'px; left: '+(startX+20*i)+'px"></div>'; 
      }
      $('ul.bhz-mod-prizeDraw-list').prepend(lights);
    },
    initRollUp: function () {
      

      var i = 1;
      var e;
     
      setInterval(function(){
        e = i%10;
        i++;
        if(e==0){
          // 用Math.ceil解决滚动多加1px bug
          $(".broadcast ul").animate({top: Math.ceil((-0.2)*getPrize.model.rootPx)*e},0)
        }else{
          $(".broadcast ul").animate({top: Math.ceil((-0.2)*getPrize.model.rootPx)*e},1500)
        }

      },5000)
    },
    showRemainTimes: function(){
      $(".surplus-btn .times").text(getPrize.model.times)
    },

    ifRun: function(){
      getPrize.ifHaveTimes()    
    },
    run: function(){

        getPrize.model.useOneTime()
        $(".prizing").show();
        
        this.Running(getPrize.model.runNumber(),this.showGet)
        

        

        
      

    },
    Running: function( num, fn){
      var aDiv = $('div.light');

      for(var i = 1; i < num+1; i++){
        (function(e){
          var n = e%9;          
          setTimeout(function(){

            //实现跑马灯动画
            for(var j = 0, len = aDiv.length; j < len; j++){
              // console.log(aDiv[j].className)
              // console.log(aDiv[j].className.match(/light color-0/));
              var oDiv = aDiv[j];
              if(oDiv.className.match(/0/g)){
                oDiv.className = oDiv.className.replace(/0/,1)
              }else if(oDiv.className.match(/1/g)){
                oDiv.className = oDiv.className.replace(/1/,2)
              }else{
                oDiv.className = oDiv.className.replace(/2/,0)
              }
               
            }

            // 实现九宫格动画
            $("#item-"+n+">.prize").removeClass("highlight");
            if(n==8){
              $("#item-1>.prize").addClass("highlight");
            }else{
              $("#item-"+(n+1)+">.prize").addClass("highlight");
            }
            if(e==num){
              // 用setTimeout解决1个先alert再渲染class的bug
              setTimeout(function(){
                console.log(e)
                fn();
              },50)
              
            }
          },2*(e*e+50))
        })(i);
      }
    },
    showGet: function(){
      $(".prizing").hide();
      $(".not-lottery").show();
      $(".not-lottery .tips").text("恭喜获得"+$(".prize.highlight").text())
      $(".not-lottery .tips").animate({bottom: "60%"},2000,function(){
        $(".not-lottery .tips").css("bottom","10%");
        $(".not-lottery").hide();
      })
    },
    sorry: function(){
      $(".no-more-chance").show();
      $(".no-more-chance .tips").animate({bottom: "60%"},2000,function(){
        $(".no-more-chance .tips").css("bottom","10%");
        $(".no-more-chance").hide();
      })
    }

    
  }

  getPrize.start()

})