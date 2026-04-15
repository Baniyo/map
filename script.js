//ボタンで階を切り替える
function showScreen(id){
  const screens=document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
//SVGの部屋をクリックしたら色が赤色になる
const obj=document.getElementById("map_1f");
obj.addEventListener("load",function(){
  const svgDoc=obj.contentDocument;
  const rooms=svgDoc.querySelectorAll("rect,path");

  rooms.forEach(room=>{
    room.dataset.originalFill=room.style.fill;
    room.addEventListener("click",function(){
      if(room.style.fill==="red"){
        room.style.fill=room.dataset.originalFill;
      }else{
        room.style.fill="red";
      }
    });
  });
});
const obj2=document.getElementById("map_2f");
obj2.addEventListener("load",function(){
  const svgDoc=obj2.contentDocument;
  const rooms=svgDoc.querySelectorAll("rect,path");

  rooms.forEach(room=>{
    room.dataset.originalFill=room.style.fill;
    room.addEventListener("click",function(){
      if(room.style.fill==="red"){
        room.style.fill=room.dataset.originalFill;
      }else{
        room.style.fill="red";
      }
    });
  });
});
const obj3=document.getElementById("map_3f");
obj3.addEventListener("load",function(){
  const svgDoc=obj3.contentDocument;
  const rooms=svgDoc.querySelectorAll("rect,path");
  rooms.forEach(room=>{
    room.dataset.originalFill=room.style.fill;
    room.addEventListener("click",function(){
      if(room.style.fill==="red"){
        room.style.fill=room.dataset.originalFill;
      }else{
        room.style.fill="red";
      }
    });
  });
});
const obj4=document.getElementById("map_4f");
obj4.addEventListener("load",function(){
  const svgDoc=obj4.contentDocument;
  const rooms=svgDoc.querySelectorAll("rect,path");

  rooms.forEach(room=>{
    room.dataset.originalFill=room.style.fill;
    room.addEventListener("click",function(){
      if(room.style.fill==="red"){
        room.style.fill=room.dataset.originalFill;
      }else{
        room.style.fill="red";
      }
    });
  });
});
const obj5=document.getElementById("map_5f");
obj5.addEventListener("load",function(){
  const svgDoc=obj5.contentDocument;
  const rooms=svgDoc.querySelectorAll("rect,path");

  rooms.forEach(room=>{
    room.dataset.originalFill=room.style.fill;
    room.addEventListener("click",function(){
      if(room.style.fill==="red"){
        room.style.fill=room.dataset.originalFill;
      }else{
        room.style.fill="red";
      }
    });
  });
});
