import { createAction, props } from '@ngrx/store';

export const changeCalendarDate = createAction(
  '[Calendar Page] Change calendar date',
  props<{ prop }>()
)

export const changeClickedDate = createAction(
  '[Calendar Page] Change clicked date',
  props<{ prop }>()
)
