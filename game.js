let canvas=document.getElementById('canvas')
let width=window.innerWidth;
let height=window.innerHeight;
canvas.width=width;
canvas.height=height;
canvas.style.background='rgb(160, 163, 142)'
let context=canvas.getContext('2d')

const keys={
   right:{
      pressed:false   
   },
   left:{
     pressed:false
   }
}
let offset=0
let  scrollspeed=0
let hillspeed=0
const levelWidth=4000

const leftLimit=100; 
const  rightLimit=width/2;

let backImg=new Image()
backImg.src="./images/background.png"

let platform=new Image()
platform.src="./images/platform.png"

let hills=new Image()
hills.src="./images/hills.png"

let spriteRunLeft=new Image()
spriteRunLeft.src="./images/spriteRunLeft.png"

let spriteRunRight=new Image()
spriteRunRight.src="./images/spriteRunRight.png"

let spriteStandLeft=new Image()
spriteStandLeft.src="./images/spriteStandLeft.png"

 let spriteStandRight=new Image()
 spriteStandRight.src="./images/spriteStandRight.png"



class Platform{
   constructor(xpos,ypos,width,height,color){
      this.xpos=xpos;
      this.ypos=ypos;
      this.width=width;
      this.height=height;
      this.color=color;
   }
   draw(context){
      // context.fillStyle=this.color;
      // context.fillRect(this.xpos,this.ypos,this.width,this.height);
      context.drawImage(platform,this.xpos,this.ypos,this.width,this.height)

   }
   animatePlatform(){
      this.xpos+=scrollspeed
   }
}

class Hills{
    constructor(xpos,ypos,width,height){
      this.xpos=xpos;
      this.ypos=ypos;
      this.width=width;
      this.height=height;
    

      
   }
   draw(context){
      // context.fillStyle=this.color;
      // context.fillRect(this.xpos,this.ypos,this.width,this.height);
      context.drawImage(hills,this.xpos,this.ypos,this.width,this.height)

   }
   animate(){
      this.xpos+=hillspeed
   }

}
class Player{
    constructor(xpos,ypos,velocity,platforms){
        this.xpos=xpos;
        this.ypos=ypos;
        this.width=65
        this.height=150;
        this.velocity={
            x:0,
            y:velocity
        }
        this.gravity=0.5
        this.onGround=false
        this.platforms=platforms;
        this.jumpHold=false

        this.frames=0
        this.sprites={
         stand:{
            right:spriteStandRight,
            left:spriteStandLeft,
            cropwidth:177,
            width:65

         },
         run:{
            right:spriteRunRight,
            left:spriteRunLeft,
            cropWidth:341,
            width:127.50

         }
        }
        this.currentSprite=this.sprites.stand.right;
        this.currentCropWidth=177
        this.width=65
        this.currentKey="stand"
    }
    draw(context){
   //      context.fillStyle='rgb(231, 147, 99)'
   //   context.fillRect(this.xpos,this.ypos,this.width,this.height)

       // drawImage(image,framexpos,frameypos,cropwidth,cropheight,)
    context.drawImage(this.currentSprite,
      this.frames*this.currentCropWidth,0,this.currentCropWidth,400,
      this.xpos,this.ypos,this.width,this.height)
     
    } 
    animate(context){
      this.frames++;
      if(this.frames>59 && (this.currentSprite===this.sprites.stand.right || this.currentSprite===this.sprites.stand.left))
      {   this.frames=0
         console.log("stand right")
      }
      else if(this.frames>28 && (this.currentSprite===this.sprites.run.right || this.currentSprite===this.sprites.run.left )){
         console.log("run right")
         this.frames=0
      }
      //   context.clearRect(0,0,width,height)
      
      if(this.jumpHold && this.velocity.y>=0){
        this.velocity.y+=this.gravity*0.3
      }else
     this.velocity.y+=this.gravity

      this.xpos+=this.velocity.x

    if(keys.right.pressed && this.xpos>=rightLimit){
         this.xpos=rightLimit;
         this.velocity.x=0
       }
    if(keys.left.pressed && this.xpos<=leftLimit){
         this.xpos=leftLimit;
         this.velocity.x=0

       }

      this.ypos+=this.velocity.y;  
      
   

     this.platforms.forEach((platform)=>{

      // platform collision
       if(this.velocity.y>=0 &&
         this.xpos+this.width>platform.xpos &&
         this.xpos<platform.xpos+platform.width &&
         this.ypos+this.height>=platform.ypos &&
         this.ypos+this.height-this.velocity.y<=platform.ypos

       ){
         console.log("platform")
         this.ypos=platform.ypos-this.height;
         this.velocity.y=0;
         this.onGround=true

       }

       // head hit  collision
      if(this.velocity.y<0 &&
         this.xpos+this.width>platform.xpos &&
         this.xpos<platform.xpos+platform.width &&
         this.ypos<platform.ypos+platform.height &&
         this.ypos-this.velocity.y>=platform.ypos+platform.height
 ){
   console.log("headHit")
   // this.ypos=platform.ypos+this.height;    wrong
   this.ypos=platform.ypos+platform.height;
   this.velocity.y=0
   this.jumpHold=false
 }

 // right side collision detection
//  let this.velocity.x=this.velocity.x-scrollspeed

 if(this.velocity.x>=0 &&
   this.ypos<platform.ypos+platform.height &&
   
   this.ypos+this.height>platform.ypos  &&
   this.xpos+this.width>platform.xpos &&
   this.xpos+this.width-this.velocity.x<=platform.xpos
 ){
   this.xpos=platform.xpos-this.width;
   this.velocity.x=0
 }
 // left side collision
 if(
  this.velocity.x<0 &&
   this.ypos<platform.ypos+platform.height &&
   this.ypos+this.height>platform.ypos &&
   this.xpos<platform.xpos+platform.width &&
   this.xpos-this.velocity.x>=platform.xpos+platform.width
 ){
     this.xpos=platform.xpos+platform.width;
     this.velocity.x=0 
 }


     })
       
          

       // ground collision
      //  if(this.ypos+this.height>height){
      //    this.ypos=height-this.height;
      //    this.velocity.y=0
      //    this.onGround=true

      //  }
   

      
       this.draw(context)

    }
}

let groundPlatforms = [
    new Platform(0, height - 50, 600, 50,'rgb(125, 240, 109)'),     // first part
    new Platform(800, height - 50, 500, 50,'rgb(37, 237, 51)'),   // second part, leaves gap between 600-800
    new Platform(1400, height - 50, 600, 50,'rgb(37, 237, 51)')   // third part
]

let hill=new Hills(0,200,levelWidth,300)
let platforms=[
    ...groundPlatforms,
    new Platform(250,250,200,50,'rgb(37, 237, 51)'),
   
    new Platform(600,300,150,50,'rgb(37, 237, 51)'),
    new Platform(800,80,100,50,'rgb(37, 237, 51)'),
    new Platform(700,50,50,50,'rgb(37, 237, 51)'),
    // new Platform(250,250,200,50,'rgb(37, 237, 51)'),
    // new Platform(250,250,200,50,'rgb(37, 237, 51)'),
]

let player1=new Player(200,200,5,platforms)
player1.draw(context)

function animatePlayer(){
    context.clearRect(0,0,width,height)
    requestAnimationFrame(animatePlayer)
    context.drawImage(backImg,0,0,width,height)

    if(player1.ypos>height){
      location.reload()
      return;
    } 

    scrollspeed=0
    hillspeed=0

    if(keys.left.pressed && player1.xpos<=leftLimit ){
     if(offset>0)
     {
      scrollspeed=5
      hillspeed=2
      offset-=5
     }
   }
 if(keys.right.pressed && player1.xpos>=rightLimit ){
   if(offset<levelWidth-width){
      scrollspeed=-5
      hillspeed=-2
      offset+=5
   }
 }
    
        
     hill.draw(context)
    platforms.forEach((platform)=>{
       platform.draw(context)
    })
 
    platforms.forEach((platform)=>{
       platform.animatePlatform()
    })

   player1.animate(context)

   hill.animate()

    
}
animatePlayer()

window.addEventListener('keydown',
   (e)=>{
//    console.log(e.key)
   if(e.key==='ArrowUp' && player1.onGround ){
      player1.velocity.y=-12
      player1.jumpHold=true;
       
      
 }
 else if(e.key==='ArrowLeft'){
    console.log(e.key)
     player1.velocity.x=-5
    keys.left.pressed=true;
    player1.currentSprite=player1.sprites.run.left;
   player1.currentCropWidth=player1.sprites.run.cropWidth;
   player1.width=player1.sprites.run.width;
   
 }
 else if(e.key==='ArrowRight'){
   player1.currentKey="right"
   player1.currentSprite=player1.sprites.run.right;
   player1.currentCropWidth=player1.sprites.run.cropWidth;
   player1.width=player1.sprites.run.width;
    player1.velocity.x=5
     keys.right.pressed=true;  //wrong
    
 }
})

window.addEventListener('keyup',(e)=>{
   if(e.key==='ArrowLeft'){
      player1.velocity.x=0
      keys.left.pressed=false;
       player1.currentSprite=player1.sprites.stand.left;
   player1.currentCropWidth=player1.sprites.stand.cropwidth;
   player1.width=player1.sprites.stand.width;

   }
   if(e.key==="ArrowRight"){
      player1.currentSprite=player1.sprites.stand.right;
   player1.currentCropWidth=player1.sprites.stand.cropwidth;
   player1.width=player1.sprites.stand.width;

      player1.velocity.x=0
      keys.right.pressed=false;  //wrong
   }
   if(e.key=='ArrowUp'){
      player1.jumpHold=false
   }
})
// let canvas=document.getElementById('canvas');
// let width=window.innerWidth;
// let height=window.innerHeight;
// canvas.width=width;
// canvas.height=height;
// canvas.style.background='rgb(150,100,100)'
// let context=canvas.getContext('2d');
// class Player{
//     constructor(xpos,ypos,width,height,velocity){
//         this.xpos=xpos;
//         this.ypos=ypos;
//         this.width=width;
//         this.height=height;
//         this.velocity={  //x y dono
//             x:0,
//             y:velocity
//         }
//         this.gravity=0.25;
//         this.onGround=false
//     }
//     draw(context){
//         context.fillStyle='rgb(200,231,99)'
//         context.fillRect(this.xpos,this.ypos,this.width,this.height)
//     }
//     animate(context, obstacles) {
//     context.clearRect(0, 0, width, height);

//     this.velocity.y += this.gravity;

//     this.xpos += this.velocity.x;
//     this.ypos += this.velocity.y;

//     this.onGround = false;

//     if (this.ypos + this.height >= height) {
//         this.ypos = height - this.height;
//         this.velocity.y = 0;
//         this.onGround = true;
//     }

//     obstacles.forEach(ob => {
//         if (
//             this.xpos < ob.x + ob.width &&
//             this.xpos + this.width > ob.x &&
//             this.ypos + this.height > ob.y &&
//             this.ypos + this.height <= ob.y + ob.height &&
//             this.velocity.y >= 0
//         ) {
//             this.ypos = ob.y - this.height;
//             this.velocity.y = 0;
//             this.onGround = true;
//         }
//     });

//     this.draw(context);
// }

// }
// class Obstacle {
//     constructor(x, y, width, height) {
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//     }

//     draw(context) {
//         context.fillStyle = 'rgb(80, 80, 80)';
//         context.fillRect(this.x, this.y, this.width, this.height);
//     }
// }

// let player1=new Player(200,200,50,50,5) //speed
// player1.draw(context)

// let obstacles = [
//     new Obstacle(300, height - 150, 200, 20),
//     new Obstacle(100, height - 300, 150, 20),
//     new Obstacle(500, height - 450, 180, 20)
// ];


// function animatePlayer() {
//     requestAnimationFrame(animatePlayer);

//     player1.animate(context, obstacles);

//     obstacles.forEach(ob => ob.draw(context));
// }

// animatePlayer()
// window.addEventListener('keydown',(e)=>{
//     console.log(e.key);
//    if (e.key === 'ArrowUp' && player1.onGround) {
//     player1.velocity.y = -12;
//     player1.onGround = false;
// }
//     if(e.key==='ArrowLeft'){
//     console.log(e.key)
//     player1.velocity.x=-5
// }
//     if(e.key==='ArrowRight'){
//     player1.velocity.x=5;
// }
// })
// window.addEventListener('keyup', (e) => {
//     if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
//         player1.velocity.x = 0;
//     }
// });

// let canvas=document.getElementById('canvas');
// let width=window.innerWidth;
// let height=window.innerHeight;
// canvas.width=width;
// canvas.height=height;
// canvas.style.background='rgb(150,100,100)'
// let context=canvas.getContext('2d');
// class Player{
//     constructor(xpos,ypos,width,height,velocity){
//         this.xpos=xpos;
//         this.ypos=ypos;
//         this.width=width;
//         this.height=height;
//         this.velocity={  //x y dono
//             x:0,
//             y:velocity
//         }
//         this.gravity=0.2;
//         this.onGround=false
//     }
//     draw(context){
//         context.fillStyle='rgb(200,231,99)'
//         context.fillRect(this.xpos,this.ypos,this.width,this.height)
//     }
//     animate(context){
//         context.clearRect(0,0,width,height)
//         this.velocity.y+=this.gravity

//          this.xpos+=this.velocity.x
//         this.ypos+=this.velocity.y
//         if(this.ypos+this.height>=height){
//             this.ypos=height-this.height
//             this.velocity.y=0
//             this.onGround=true
//         }
//         else {
//             this.onGround = false;
//         }
//         // this.xpos+=this.velocity.x
//         // this.ypos+=this.velocity.y
//         this.draw(context)
//     }
// }
// let player1=new Player(200,200,50,50,5) //speed
// player1.draw(context)

// function animatePlayer(){
//     requestAnimationFrame(animatePlayer)
//     player1.animate(context);
// }
// animatePlayer()
// window.addEventListener('keydown',(e)=>{
//     console.log(e.key);
//    if (e.key === 'ArrowUp' && player1.onGround) {
//     player1.velocity.y = -12;
//     player1.onGround = false;
// }
//     if(e.key==='ArrowLeft'){
//     console.log(e.key)
//     player1.velocity.x=-5
// }
//     if(e.key==='ArrowRight'){
//     player1.velocity.x=5;
// }
// })
// window.addEventListener('keyup', (e) => {
//     if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
//         player1.velocity.x = 0;
//     }
// });
