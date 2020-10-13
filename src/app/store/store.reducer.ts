import { createReducer, on } from '@ngrx/store';
import { changeCalendarDate, changeClickedDate } from './store.actions';

export const initialCalendarState = {
  date: new Date(),
  clickedDate: new Date()
};

const _calendarReducer = createReducer(
  initialCalendarState,
  on(changeCalendarDate, (state, { prop }) => ({...state, date: prop })),
  on(changeClickedDate, (state, { prop }) => ({...state, clickedDate: prop })),
)

export function calendarReducer(state, action) {
  return _calendarReducer(state, action)
}
