export type GameResult = {
    game_id: string;
    seed_game_id: string;
    players: number;
    generations: number;
    game_options: string;
    scores: string;
  };
  
  export type Score = {
    corporation: string;
    playerScore: number;
  };