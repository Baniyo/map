//ボタンで階を切り替える
function showScreen(id){
  const screens=document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
//SVGの部屋をクリックしたら色が赤色になる
const obj=document.getElementById("map_2f");
obj.addEventListener("load",function(){
  const svgDoc=obj.contentDocument;
  const rooms=svgDoc.querySelectorAll("rect,path");
  rooms.forEach(room=>{
    room.addEventListener("click",function(){
      if(room.style.fill==="red"){
        room.style.fill="";
      }else{
         room.style.fill = "red";
      }
    });
  });
});