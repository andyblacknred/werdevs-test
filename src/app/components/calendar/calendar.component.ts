import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { changeClickedDate, changeCalendarDate } from "../../store/store.actions";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  now = new Date();
  date = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  curentMonthDaysArray = [];
  filledCurentMonthDaysArray = [];
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  clickedDate = this.now;
  isPopupShow = false;
  endOfDayName = 'th ';

  calendar$: Observable<{ date: Date, clickedDate: Date } >;

  constructor(private store: Store<{ calendar: { date, clickedDate } }>) {
    this.calendar$ = store.select('calendar');
  }

  getDaysInMonth(month, year) {
    let date = new Date(year, month, 1);
    let days = [];
    while (date.getMonth() === month) {
      let day = new Date(date);
      let dayObj = {
        day: day,
        isInCurrentMonth: true,
        isCurrentDay: day.getDate() === this.now.getDate() && day.getMonth() === this.now.getMonth() && day.getFullYear() === this.now.getFullYear()
      }
      days.push(dayObj);
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  fillEmptyDays(daysArray) {
    let firstDayOfCurrentMonth = daysArray[0];
    let lastDayOfCurrentMonth = daysArray[daysArray.length - 1];
    let i = 0;
    while(daysArray[0].day.getDay() !== 0) {
      let day = new Date(firstDayOfCurrentMonth.day.getFullYear(), firstDayOfCurrentMonth.day.getMonth(), i)
      daysArray.unshift({
        day: day,
        isInCurrentMonth: false,
        isCurrentDay: day.getDate() === this.now.getDate() && day.getMonth() === this.now.getMonth() && day.getFullYear() === this.now.getFullYear()
      });
      i--;
    }
    let j = 1;
    while(daysArray[daysArray.length - 1].day.getDay() !== 6) {
      let day = new Date(lastDayOfCurrentMonth.day.getFullYear(), lastDayOfCurrentMonth.day.getMonth() + 1, j);
      daysArray.push({
        day: day,
        isInCurrentMonth: false,
        isCurrentDay: day.getDate() === this.now.getDate() && day.getMonth() === this.now.getMonth() && day.getFullYear() === this.now.getFullYear()
      });
      j++;
    }
    return daysArray;
  }

  splitTo(arr, chunk_size) {
    let arrayLength = arr.length;
    let tempArray = [];

    for (let index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = arr.slice(index, index+chunk_size);
      tempArray.push(myChunk);
    }

    return tempArray;
  }

  buildFilledCurentMonthDaysArray(date) {
    this.curentMonthDaysArray = this.getDaysInMonth(date.getMonth(), date.getFullYear());
    this.filledCurentMonthDaysArray = this.fillEmptyDays(this.curentMonthDaysArray);
    this.filledCurentMonthDaysArray = this.splitTo( this.curentMonthDaysArray, 7 );
  }

  changeMonth(direction) {
    if(direction === 'next') {
      let date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      this.store.dispatch(changeCalendarDate({ prop: date }));
    } else if(direction === 'prev') {
      let date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
      this.store.dispatch(changeCalendarDate({ prop: date }));
    }
  }

  showPopup(date) {
    this.store.dispatch(changeClickedDate({ prop: date }))
    if(date.getDate() === 1 || date.getDate() === 21 || date.getDate() === 31) {
      this.endOfDayName = 'st '
    } else if(date.getDate() === 2 || date.getDate() === 22) {
      this.endOfDayName = 'nd '
    } else if(date.getDate() === 3 || date.getDate() === 23) {
      this.endOfDayName = 'rd '
    } else {
      this.endOfDayName = 'th '
    }
    this.isPopupShow = true;
  }

  ngOnInit(): void {
    this.calendar$.subscribe(res => {
      this.date = res.date;
      this.clickedDate = res.clickedDate;
      this.buildFilledCurentMonthDaysArray(this.date);
    })
  }

}
