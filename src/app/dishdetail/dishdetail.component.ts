import {Component, Inject, OnInit, ViewChild,} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  commentForm: FormGroup;

  @ViewChild('cform') commentFormDirective;

  formErrors = {
    author: '',
    comment: ''
  };

  validationMessages = {
   author: {
     required: 'Author\'s name is required',
     minlength: 'Author\'s name must be at least 2 characters long'
   },
   comment: {
     required : 'Comment is required'
   }
  };

  dish: Dish ;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(private dishService: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('baseURL') private baseURL) {
    this.createForm();
  }

  ngOnInit(): void {
    this.dishService.getDishIds()
      .subscribe((dishIds) => {this.dishIds = dishIds; });
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params.id)))
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });

  }

  private createForm(){
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', Validators.required],
      rating: 5,
      date: ''
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any){
    if (!this.commentForm){return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)){
        // clear previous error message
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }

  onSubmit(){
    this.commentForm.value.date = (new Date).toISOString();
    this.dish.comments.push(this.commentForm.value);
    this.commentForm.reset({
      author: '',
      date: '',
      rating: 5,
      comment: '',
    });
    this.commentFormDirective.resetForm({
      author: '',
      date: '',
      rating: 5,
      comment: '',
    });
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

}
