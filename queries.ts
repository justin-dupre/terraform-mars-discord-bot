export const GET_WINNERS_QUERY = `SELECT
all_scores.game_id,
all_scores.corporation,
  all_scores.score 
FROM(
select 
    game_id,
    MAX((scoresJson->>'playerScore')::int) as score
from game_results
cross join json_array_elements(scores::json) scoresJson
GROUP BY game_id
) max_scores, 
(
select 
    game_id,
    (scoresJson->>'corporation') as corporation,
    (scoresJson->>'playerScore')::int as score
from game_results
cross join json_array_elements(scores::json) scoresJson
) all_scores
WHERE max_scores.game_id = all_scores.game_id 
AND max_scores.score = all_scores.score
AND all_scores.corporation != 'Beginner Corporation'`;

export const GET_CORP_TOTAL_WINS = (corp: string) => {
  return `SELECT
  all_scores.corporation,
  COUNT(all_scores.corporation)
FROM(
  select 
      game_id,
      MAX((scoresJson->>'playerScore')::int) as score
  from game_results
  cross join json_array_elements(scores::json) scoresJson
  GROUP BY game_id
) max_scores, 
(
  select 
      game_id,
      (scoresJson->>'corporation') as corporation,
      (scoresJson->>'playerScore')::int as score
  from game_results
  cross join json_array_elements(scores::json) scoresJson
) all_scores
WHERE max_scores.game_id = all_scores.game_id 
AND max_scores.score = all_scores.score
AND all_scores.corporation = '${corp}'
GROUP BY all_scores.corporation`;
};

export const GET_TOTAL_GAMES_PLAYED_BY_CORP_QUERY = (corp: string) => {
  return `SELECT
    (scoresJson->>'corporation') as corporation,
    COUNT((scoresJson->>'corporation'))
FROM game_results
CROSS JOIN json_array_elements(scores::json) scoresJson
WHERE (scoresJson->>'corporation')='${corp}'
GROUP BY (scoresJson->>'corporation')`;
};
