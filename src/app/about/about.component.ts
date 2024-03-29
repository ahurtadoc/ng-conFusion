import {Component, Inject, OnInit} from '@angular/core';
import {LeaderService} from '../services/leader.service';
import {Leader} from '../shared/leader';
import {expand, flyInOut} from '../animations/app.animation';
import {baseURL} from '../shared/baseurl';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;'
  },
  animations: [flyInOut(), expand()]
})
export class AboutComponent implements OnInit {
  leaders: Leader[];
  errorMsg: string;
  constructor(private leaderService: LeaderService,
              @Inject('baseURL') private baseUrl) { }

  ngOnInit(): void {
    this.leaderService.getLeaders()
      .subscribe((leaders) => this.leaders = leaders,
        errorMess => this.errorMsg = errorMess);
  }


}
