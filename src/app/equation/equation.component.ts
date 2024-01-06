import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MathValidators } from '../math-validators';
import { delay, filter, scan } from 'rxjs/operators';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrl: './equation.component.css'
})
export class EquationComponent implements OnInit {
  rndNumbers = this.randomNumbers();
  secondsPerSolution = 0;
  mathForm = new FormGroup({
    a: new FormControl(this.rndNumbers.n1),
    b: new FormControl(this.rndNumbers.n2),
    answer: new FormControl('')
  }, [MathValidators.addition('answer', 'a', 'b')]);

  ngOnInit() {
    this.mathForm.statusChanges.pipe(
      filter(value => value === 'VALID'),
      delay(100),
      scan((acc) => {
        return {
          numberSolved: acc.numberSolved + 1,
          startTime: acc.startTime
        }
      }, { numberSolved: 0, startTime: new Date() })
    ).subscribe(({ numberSolved, startTime }) => {
      this.secondsPerSolution = (new Date().getTime() - startTime.getTime()) / numberSolved / 1000;
      let rndNumbers = this.randomNumbers();
      this.mathForm.setValue({
        a: rndNumbers.n1,
        b: rndNumbers.n2,
        answer: ''
      });
    });
  }

  get a() {
    return this.mathForm.value.a;
  }

  get b() {
    return this.mathForm.value.b;
  }
  
  randomNumbers() {
    do {
      var n1 = Math.floor(Math.random() * 10);
      var n2 = Math.floor(Math.random() * 10);
    } while (n1 + n2 > 9)
    return { n1, n2 };
  }
}
