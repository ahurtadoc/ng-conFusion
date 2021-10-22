import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Feedback, ContactType} from '../shared/feedback';
import {FeedbackService} from '../services/feedback.service';
import {expand, visibility} from '../animations/app.animation';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [visibility(), expand()]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  confirmState: Feedback;
  spinnerState = false;
  formState = true;
  contactType =  ContactType;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    firstname: '',
    lastname: '',
    telnum: '',
    email: ''
  };

  validationMessages = {
    firstname: {
      required : 'First name is required',
      minlength: 'First name must be at least 2 character long',
      maxlength : 'First name cannot be more than 25 characters long'
    },
    lastname: {
      required : 'Last name is required',
      minlength: 'Last name must be at least 2 character long',
      maxlength : 'Last name cannot be more than 25 characters long'
    },
    telnum: {
      required: 'Tel. number is required',
      pattern: 'Tel. number must contain only numbers'
    },
    email: {
      required: 'Email is required',
      email: 'Email not in valid format'
    }
  };

  constructor(private fb: FormBuilder,
              private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  private createForm(): void {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: '',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any): void {
    if (!this.feedbackForm){return; }
    const form = this.feedbackForm;
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


  onSubmit(): void {
    this.feedback = this.feedbackForm.value;
    this.formState = false;
    this.spinnerState = true;
    this.feedbackService.submitFeedbackForm(this.feedback).subscribe(feedbackResponse => {
      this.spinnerState = false;
      this.confirmState = feedbackResponse;
      setTimeout(() => {
        this.confirmState = null;
        this.formState = true;
      }, 5000);
    });

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackFormDirective.resetForm();
  }
}
