document.addEventListener('DOMContentLoaded',()=>{
    let court=document.getElementsByClassName('court')[0];
    console.log(court);
    const cellSize=20;
    let leftPaddlePosition={top:300};
    let lastPlayerBallCollidedWith="L";
    let rightPaddlePosition={top:300};
    let ballPosition={top:300,left:300};
    let collsionMannerLeft=0;
    let collsionMannerTop=-20;
    let scoreLeft=0;
    let scoreRight=0;
    let setid;
// drawBall and l

function celebrate(winner) {
    // Clear any existing winner message
    document.body.innerHTML='';
    const existingMessage = document.getElementById('winner-message');
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }

    // Create a new winner message
    const winnerMessage = document.createElement('h1');
    winnerMessage.id = 'winner-message';
    winnerMessage.textContent = `${winner} Wins!`;
    winnerMessage.style.position = 'fixed';
    winnerMessage.style.top = '50%';
    winnerMessage.style.left = '50%';
    winnerMessage.style.transform = 'translate(-50%, -50%)';
    winnerMessage.style.fontSize = '3em';
    winnerMessage.style.color = '#333'; // Dark text for clarity
    winnerMessage.style.zIndex = '9999'; // Ensure it's on top

    document.body.appendChild(winnerMessage);
}

 

// now from here we have to cases 1->poorani locaion pata goni chahiye 
function endGame(){
    console.log('endGame is called',setid);
    clearInterval(setid);
    if(scoreLeft>=24) celebrate('LeftPlayer')
    else celebrate('RightPlayer');
}
function showInstructions() {
    const instructionDiv = document.createElement('div');
    instructionDiv.className = 'instruction-overlay';
    
    const instructionText = document.createElement('div');
    instructionText.className = 'instruction-text';
    instructionText.innerHTML = `
        <h2>Welcome to Ping Pong!</h2>
        <p>Use Arrow Up & Arrow Down for Left Paddle</p>
        <p>Use W & S for Right Paddle</p>
    `;
    
    const playerOnePaddle = document.createElement('div');
    playerOnePaddle.className = 'paddle player-one-paddle';
    
    const playerTwoPaddle = document.createElement('div');
    playerTwoPaddle.className = 'paddle player-two-paddle';
    
    const pingPongBall = document.createElement('div');
    pingPongBall.className = 'balls';

    document.body.appendChild(instructionDiv);
    instructionDiv.appendChild(instructionText);
    instructionDiv.appendChild(playerOnePaddle);
    instructionDiv.appendChild(playerTwoPaddle);
    instructionDiv.appendChild(pingPongBall);

    // Animation for paddles and ball
    let ballDirection = 1; // 1 for right, -1 for left
    let ballSpeed = 4;
    let ballPosition = 0;

    const animationInterval = setInterval(() => {
        ballPosition += ballDirection * ballSpeed;
        pingPongBall.style.transform = `translateX(${ballPosition}px)`;

        // Change ball direction when it hits the paddles
        if (ballPosition >= window.innerWidth - 50 || ballPosition <= 0) {
            ballDirection *= -1; // Reverse direction
        }
    }, 50);

    // Remove instructions after 5 seconds
     setid=setTimeout(() => {
        clearInterval(animationInterval);
        document.body.removeChild(instructionDiv);
    }, 5000);
}

function updateScore(leftScore, rightScore) {
    document.getElementById('left-score').textContent = leftScore;
    document.getElementById('right-score').textContent = rightScore;
}
function manageBallMovement(lastPlayer, bt, bl) {
    if (lastPlayer === 'L') {
        // Ball hit left paddle, reverse X direction and set Y based on paddle position
        collsionMannerLeft = 20; // Set speed to the right
        collsionMannerTop = (bt - leftPaddlePosition.top - 30) / 3; // Adjust Y speed based on collision position
    } else {
        // Ball hit right paddle, reverse X direction and set Y based on paddle position
        collsionMannerLeft = -20; // Set speed to the left
        collsionMannerTop = (bt - rightPaddlePosition.top - 30) / 3; // Adjust Y speed based on collision position
    }
}

function drawBall(){
    ballPosition.left=ballPosition.left+collsionMannerLeft;
    ballPosition.top=ballPosition.top+collsionMannerTop;
    let ball=document.createElement('div');
    ball.classList.add('ball');
    ball.style.top=`${ballPosition.top}px`;
    ball.style.left=`${ballPosition.left}px`;
    court.prepend(ball);
}
function checkCollisonWithHorizontalBoundary(bt,bl){
   return (bt<=0 ||bt>=600)? true:false;
    
}
function startAgain(){
     leftPaddlePosition={top:300};
     lastPlayerBallCollidedWith;
     rightPaddlePosition={top:300};
     ballPosition={top:300,left:300};
     collsionMannerLeft=20;
     collsionMannerTop=0;

}
function checkCollisonWithPaddle(bt,bl){
    // we nned to check which side of the net ball lies to know where is the collison with the paddle going to happen
    if(bl<=300){// we know only ball can Collide with left paddle
     return (bl<=20 && (bt>=leftPaddlePosition.top && bt<=leftPaddlePosition.top+60))? true:false;

    } else {
        // ball here may collide with right  paddle
     return (bl>=580 && (bt>=rightPaddlePosition.top && bt<=rightPaddlePosition.top+60))?  true:false;
    }

}
function checkCollisonWithVerticalBounday(bt,bl){
    return (bl<=0 || bl>=600)? true:false;
}
function UpdatePositionOfBallAndCheckCollison(){
    let bt=ballPosition.top;
    let bl=ballPosition.left;
    let cp=checkCollisonWithPaddle(bt,bl);
    let cv=checkCollisonWithVerticalBounday(bt,bl);
   let ch= checkCollisonWithHorizontalBoundary(bt,bl);
   if(ch){
    
    if(bt<=0){
        if(lastPlayerBallCollidedWith=='L'){
            collsionMannerLeft=20;
            collsionMannerTop=20;

        } else {
            collsionMannerLeft=-20;
            collsionMannerTop=20;

        }

    } else {
        if(lastPlayerBallCollidedWith=='L'){
            collsionMannerLeft=20;
            collsionMannerTop=-20;
        } else {
            collsionMannerLeft=-20;
            collsionMannerTop=-20;
        }

    }

   }
   
  else  if(cp){
    
    lastPlayerBallCollidedWith=(bl<=300)? 'L':'R';

    manageBallMovement(lastPlayerBallCollidedWith,bt,bl);

   }
   
    else if(cv){
     let scoreUpdated=false;
    (bl<=300)? scoreRight++:scoreLeft++;
    updateScore(scoreLeft,scoreRight);
    startAgain();
    return 
    }
     
   }


function checkBoundary(key){
     if(key=='ArrowUp' && leftPaddlePosition.top<20) return false;
     if(key=='ArrowDown' && leftPaddlePosition.top>=570) return false;
     if(key=='w' && rightPaddlePosition.top<20) return false;
     if(key=='s' && rightPaddlePosition.top>=570) return false;
     return true;
}
function updatePaddleAndNet(){
    let lfp=drawDivAndNet('lp');
        let rgp=drawDivAndNet('rp');
        court.innerHTML='';
         court.prepend(lfp);
         court.prepend(rgp);
         drawNet();
}
function gameLoop(){
     setId=setInterval(()=>{
        if(scoreLeft>=24|| scoreRight>=24){
            endGame();
            return;
        }
         updatePaddleAndNet();

         // i have to write a function to manage the movement of ball jo default hoga
         // now on collison
        UpdatePositionOfBallAndCheckCollison();
         drawBall();
    },60);
}
   function managePaddleDirection(e){
    let keyPressed=e.key;
    console.log(e.key);
    let isInsideBoundary=checkBoundary(keyPressed);
    if(!isInsideBoundary) return;
    if(e.key=='ArrowUp'){
       leftPaddlePosition.top=leftPaddlePosition.top-40;

    } else if(e.key=='ArrowDown'){
        leftPaddlePosition.top=leftPaddlePosition.top+40;

    } else if(e.key=='w'){
        rightPaddlePosition.top=rightPaddlePosition.top -40;

    } else if(e.key=='s'){
       rightPaddlePosition.top=rightPaddlePosition.top+40;
    }
    console.log(leftPaddlePosition.top);
     
    }
   function drawNet(){
    let net=document.createElement('div');
    net.classList.add('net');
    court.prepend(net);
    }
 
   function drawDivAndNet(paddle){
   

     if(paddle=='lp'){
       let leftPaddle=document.createElement('div');
       leftPaddle.setAttribute('id','left-paddle');
       leftPaddle.style.top=`${leftPaddlePosition.top}px`;
    
       return leftPaddle;

     } else {
        let rightPaddle=document.createElement('div');
       rightPaddle.setAttribute('id','right-paddle');
       rightPaddle.style.top=`${rightPaddlePosition.top}px`;
       return rightPaddle;

     }

   }
 let startButton=document.createElement('button');
 startButton.classList.add('start-button');
 startButton.innerHTML='StartGame';
 document.body.appendChild(startButton);
startButton.addEventListener('click',()=>gameLoop());
 document.addEventListener('keydown',managePaddleDirection);
 showInstructions();
  
 









})