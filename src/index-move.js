export const handler = async (event) => {
    // TODO implement
      console.log("event!", event);
      
      
      /*super simple to see it in action. This will last until it runs out of life
      it will go up if it can until it can no longer then it will go left 
      if it cant go up or left then it will go down
      if it cant go down then it will go right
      this will repeat until no more life
      this is not good at all since is not taking in consideration enemies posible movement or life or food.
      this is just to see it working
      
      fill out map with location of snakes 
      then use logic above to determine move
      
    
      */
      let jsonBody = JSON.parse(event.body);
      let width = jsonBody.board.width;
      let height = jsonBody.board.height;
      let map = {};
      // add board with fals.... btw this can be done a lot better but im just testing :)
      for (let x = 0; x < width; x++){
        for (let y = 0; y < height; y++){
          map[x+'-'+y] = false;
        }
      }
      //iterate over every body/head in the board (you included already in this)
      for (let snake of jsonBody.board.snakes){
         for (let parts of snake.body) {
           let key = parts.x + "-" + parts.y;
           map[key] = true;
         }
      }
      console.log("mapsnakes", map);
      let response = {};
     
      let headX = jsonBody.you.head.x;
      let headY = jsonBody.you.head.y;
       //try up
    
      let keyCheck = headX+'-'+(headY + 1);
      if (map[keyCheck] !== undefined && map[keyCheck] !== true) {
        console.log("go up");
        response.move = 'up';
      } else if (map[(headX - 1 ) + '-' + headY] !== undefined && map[(headX - 1 ) + '-' +headY] !== true) {
        console.log("go left");
        response.move = 'left';
      }  else if (map[headX + '-' + (headY - 1)] !== undefined && map[headX + '-' + (headY - 1)] !== true) {
        console.log("go down");
        response.move = 'down';
      } else if (map[(headX + 1) + '-' + headY] !== undefined && map[(headX + 1) + '-' + headY] !== true) {
        console.log("go right");
        response.move = 'right';
      } else {
        console.log("nadaa", keyCheck);
      } 
      
      return response;
  };
  