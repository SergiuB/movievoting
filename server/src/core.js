import {List, Map, fromJS} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) return [];
  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);
  if      (aVotes > bVotes)  return [a];
  else if (aVotes < bVotes)  return [b];
  else                       return [a, b];
}

export function next(state) {
  const winners = getWinners(state.get('vote'));
  if (winners.length === 1 && !state.get('entries').count()) {
    return Map({
      winner: winners[0]
    });
  } else {
    const entries = state.get('entries')
                         .concat(winners);

    return state.merge({
      vote: Map({pair: entries.take(2)}),
      entries: entries.skip(2)
    });
  }
}

export function vote(state, movie) {
  return state.updateIn(
    ['tally', movie], 
    0, 
    val => val + 1);
}