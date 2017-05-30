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


//From Mozilla Docs
const flatten = arr => arr.reduce(
  (acc, val) => acc.concat(
    Array.isArray(val) ? flatten(val) : val
  ),
  []
);

const criterion = function(field, value) {
  return {field: field, value: value, operator: "="};
}

const filterCount = function(collection, value) {
  return collection.filter(function(item) {
    switch (value) {
      case "full":
        return item["balls"] === 3 && item["strikes"] === 2
      case "even":
        return item["balls"] === item["strikes"]
      case "ahead":
        return item["balls"] < item["strikes"]
      case "behind":
        return item["balls"] > item["strikes"] && item["strikes"] < 2
      default:
        return true;
    }
  });
}

const filterName = function(collection, value) {
  const nameHits = collection.filter(function(item) {
    let nameTokens = item["batter_name"].toLowerCase().split(",").map(d => d.trim());
    return nameTokens.find(d => value.split(" ").find(e => e === d));
  });

  if (nameHits.length === 0) {
    return collection;
  }

  return nameHits;
}

const applyFilter = function(collection, filterParams) {
  if (filterParams.field === "count") {
    return filterCount(collection, filterParams.value);
  }

  if (filterParams.field === "batter_name") {
    return filterName(collection, filterParams.value);
  }

  return collection.filter(function(item) {
    return item[filterParams.field] === filterParams.value;
  });
}

const handedness = function(terms) {
  let filters = [];
  const field = "batter_side"
  if (/\blefty?\b|\blefties?\b/.test(terms)) {
    filters.push(criterion(field, "L"))
  }
  if (/\brighty?\b|\brighties?\b/.test(terms)) {
    filters.push(criterion(field, "R"))
  }

  return filters;
}

const outcome = function(terms) {
  //"OUT", "K", "1B", "2B", "HR", "UBB", null, "HBP", "SAC", "ROE", "SF", "3B"
  let filters = [];
  const field = "pa_outcome"

  if (/\b1bs?\b|\bsingles?\b/.test(terms)) {
    filters.push(criterion(field, "1B"))
  }
  if (/\b2bs?\b|\bdoubles?\b/.test(terms)) {
    filters.push(criterion(field, "2B"))
  }
  if (/\b3bs?\b|\btriples?\b/.test(terms)) {
    filters.push(criterion(field, "3B"))
  }
  if (/\bhrs?\b|\bhomers?\b|\bhome runs?\b/.test(terms)) {
    filters.push(criterion(field, "HR"))
  }
  if (/\bks?\b|\bstrike\s?outs?\b/.test(terms)) {
    filters.push(criterion(field, "K"))
  }
  if (/\bbbs?\b|\bwalks?\b/.test(terms)) {
    filters.push(criterion(field, "UBB"))
  }
  if (/\bbbps?\b|\bhit\s?by\s?pitch\b/.test(terms)) {
    filters.push(criterion(field, "UBB"))
  }

  // if this filter is applied, show only outcome pitches
  if (filters.length > 0) {
    filters.push(criterion("is_pa_pitch", true))
  }

  return filters;
}

const pitchType = function(terms) {
  let filters = [];
  const field = "pitch_type"
  if (/\b(4|four)[-\s]?seam(er)?s?\s?(fastballs?)?\b|\bfa\b/.test(terms)) {
    filters.push(criterion(field, "FA"))
  }
  if (/\bcutters?\b|\bfc\b/.test(terms)) {
    filters.push(criterion(field, "FC"))
  }
  if (/\bchange[-\s]ups?\b|\bch\b/.test(terms)) {
    filters.push(criterion(field, "CH"))
  }
  if (/\sinkers?\b|\bsi\b/.test(terms)) {
    filters.push(criterion(field, "SI"))
  }
  if (/\bcurve[-\s]?(ball)?s?\b|cu\b/.test(terms)) {
    filters.push(criterion(field, "CU"))
  }

  return filters;
}

const swing = function(terms){
  let filters = [];

  if (/\bswings?\b/.test(terms)) {
    filters.push(criterion("is_swing", true))
  }
  if (/\bballs?\b/.test(terms)) {
    filters.push(criterion("is_called_ball", true))
  }
  if (/\bcalled\s?strikes?\b/.test(terms)) {
    filters.push(criterion("is_called_strike", true))
  }
  if (/\bwhiffs?\b|\bswings?\sand\smiss(es)?\b/.test(terms)) {
    filters.push(criterion("is_swing", true))
    filters.push(criterion("is_foul", false))
    filters.push(criterion("is_bip", false))
  }

  return filters;
}

const count = function(terms) {
  let filters = [];
  const field = "count"

  if (/\bahead\b/.test(terms)) {
    filters.push(criterion(field, "ahead"))
  }
  if (/\bbehind\b/.test(terms)) {
    filters.push(criterion(field, "behind"))
  }
  if (/\beven\b/.test(terms)) {
    filters.push(criterion(field, "even"))
  }
  if (/\bfull\b/.test(terms)) {
    filters.push(criterion(field, "full"))
  }

  return filters;
}

const batterName = function(terms) {
  let filters = [];
  const field = "batter_name"

  filters.push(criterion(field, terms))

  return filters;
}

const allFilters = [
  handedness,
  outcome,
  pitchType: pitchType,
  swing,
  count,
  batterName
]

const parseQuery = function(query) {
  const terms = query.toLowerCase();
  const filtersToApply = flatten(allFilters.map(filter => filter(terms)))
  return filtersToApply;
}

const filter = function(pitches, query) {
  let results = pitches;
  parseQuery(query).forEach(function(filterParams) {
    results = applyFilter(results, filterParams);
  });

  return results;
}

exports.search = filter;
