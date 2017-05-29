// pitch_id: 390712011011012,
// game_date: '2016-04-05',
// pitcher_id: 452657,
// pitcher_name: 'Lester, Jon',
// pitcher_throws: 'L',
// batter_id: 488862,
// batter_name: 'Escobar, Yunel',
// batting_team_abbr: 'LAA',
// batter_side: 'R',
// inning: 1,
// inning_bottom: 1,
// pa_number: 1,
// pitch_number: 1,
// balls: 0,
// strikes: 0,
// outs: 0,
// base_state: '000',
// pitch_type: 'SI',
// velocity: 92.38,
// location_x: -1.086,
// location_z: 2.003,
// is_pa_pitch: false,
// pa_outcome: 'OUT',
// hit_trajectory: null,
// exit_velocity: null,
// is_called_ball: true,
// is_called_strike: false,
// is_swing: false,
// is_foul: false,
// is_bip: false,
// video: 'https://cvmdo.bamnetworks.com/mlbam/2016/04/06/446880/coaching_video/cv_575333983_4500K.mp4'


const fieldMap = {
  h: "batter_side",
  hand: "batter_side",
  v: "velocity",
  velo: "velocity",
  velocity: "velocity",
  outcome: "pa_outcome"
}

const parseCriterion = function(criterion) {
  let tokens = criterion.split(":");
  let field = fieldMap[tokens[0]];
  let value = tokens[1];

  return {field: field, value: value, operator: "="};
}

const applyFilter = function(collection, filterParams) {
  return collection.filter(function(item) {
    return item[filterParams.field] === filterParams.value;
  });
}

const filter = function(pitches, query) {
  let results = pitches;
  query.split(" ").forEach(function(criterion) {
    let filterParams = parseCriterion(criterion);
    results = applyFilter(results, filterParams);
  });

  return results;
}

exports.search = filter;
