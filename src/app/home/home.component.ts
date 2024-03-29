import {Component, Inject, OnInit} from '@angular/core';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {Promotion} from '../shared/promotion';
import {PromotionService} from '../services/promotion.service';
import {LeaderService} from '../services/leader.service';
import {Leader} from '../shared/leader';
import {expand, flyInOut} from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;'
  },
  animations: [flyInOut(), expand()]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrorMsg: string;
  promotionErrorMsg: string;
  leaderErrorMsg: string;

  constructor(private dishService: DishService,
              private promotionService: PromotionService,
              private leaderService: LeaderService,
              @Inject('baseURL') private baseURL) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
      .subscribe((dish) =>  this.dish = dish,
        errorMess => this.dishErrorMsg = <any> errorMess);

    this.promotionService.getFeaturedPromotion()
      .subscribe((promotion) => this.promotion  = promotion,
        errorMess => this.promotionErrorMsg = <any> errorMess);

    this.leaderService.getFeaturedLeader()
      .subscribe((leader) => this.leader = leader,
        erroMess => this.leaderErrorMsg = <any> erroMess);
  }

}
