/* tslint:disable:no-trailing-whitespace */
import {Component, OnInit, EventEmitter, Output, Input, ElementRef, HostListener, ViewChild} from '@angular/core';
import {PullToRefreshService} from './pull-to-refresh.service';


interface PullToRefreshConfigInterface {
  target: string;
}

@Component({
  selector: 'pull-to-refresh',
  templateUrl: './pull-to-refresh.component.html',
  styleUrls: ['./pull-to-refresh.component.scss']
})
export class PullToRefreshComponent implements OnInit {

  @Input('config') config: PullToRefreshConfigInterface = {
    target: 'body'
  };

  @Input('disabled') disabled: boolean;

  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();



  /**
   * Stato attivazione
   */
  activated = false;

  /**
   * Elemento che riceve lo scroll
   */
  elementScrollable: HTMLElement;

  /**
   * Rotazione dell'icon spinner
   */
  rotation = 0;
  spin = false;

  /**
   * posizione Y di inizio sul touchstart
   */
  startY = 0;

  /**
   * posizione X di inizio sul touchstart
   */
  startX = 0;

  /**
   * posizione Y del touchmove
   */
  moveY = 0;

  /**
   * posizione X del touchmove
   */
  moveX = 0;

  /**
   * Spostamento in pixel dello spinner
   */
  pull = 0;
  pullFirst = 0;

  /**
   * Spostamento massimo in pixel dello spinner
   */
  maxPull = 138;
  maxFirstPull = 60;

  /**
   * posizione Y dell'animazione finale
   */
  animateY = 80;

  /**
   * Spostamento in pixel che attiva il refresh
   */
  pullToRefresh = 90;

  radiusLeft = 0;
  radiusRight = 0;

  isFirstTime = true;

  constructor(
      private refreshService: PullToRefreshService
  ) {

  }

  ngOnInit() {

    this.elementScrollable = document.querySelector(this.config.target);

    window.addEventListener('touchstart', this.onTouchStart.bind(this), {passive: true});
    window.addEventListener('touchmove', this.onToucMove.bind(this), {passive: true});
    window.addEventListener('touchend', this.onTouchEnd.bind(this), {passive: true});
    window.addEventListener('touchcancel', this.onTouchEnd.bind(this), {passive: true});

  }

  getScrollTop() {

    if (this.config.target === 'body') {
      return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    return this.elementScrollable.scrollTop;

  }

  onTouchStart($e) {

    if (this.disabled || this.activated) {
      return;
    }

    this.reset();

    this.startY = $e.touches[0].pageY;

  }

  onToucMove($e) {

    if (this.disabled) {
      return;
    }

    this.moveY = $e.touches[0].pageY;
    this.moveX = $e.touches[0].pageX;


    if (this.getScrollTop() > 0) {
      this.isFirstTime = true;
      // console.log('impostato firstime true');
    }

    const shift = (this.moveY - this.startY);

    if (this.getScrollTop() === 0 && this.moveY >= this.startY) {

      setTimeout(() => {
        this.elementScrollable.style.overflowY = 'hidden';
      });


      if (this.isFirstTime) {

        this.pullFirst = shift >= this.maxFirstPull ? this.maxFirstPull : shift;

        const width = this.elementScrollable.offsetWidth;
        const x = parseInt(((100 * this.moveX) / width).toString(), 10);

        let left;
        let right;

        if ( x <= 50 )  {
          // left
          right = 100 - x;
          left = x;
        } else {
          // right
          right = 100 - x;
          left = 100 - (100 - x);
        }

        this.radiusLeft = left < 0 ? 0 : left;
        this.radiusRight = right < 0 ? 0 : right;

      } else {

        const pullShift = shift / 2;

        this.pull = (pullShift >= this.maxPull) ? this.maxPull : pullShift + ((this.maxPull - pullShift) * 0.5);

        this.rotation = (360 * this.pull) / this.maxPull;

        this.activated = (this.pull >= this.pullToRefresh);

      }

    }


  }

  onTouchEnd($e) {

    if (this.disabled) {
      return;
    }

    if ( this.activated ) {
      this.spin = true;
      this.pull = this.animateY;

      document.dispatchEvent(new Event('pullrefresh'));
      this.refreshService.pull();
      this.refresh.emit();


      setTimeout(() => {

        this.reset();

      }, 1500);

    } else {
      this.reset();
    }

  }

  reset() {
    this.elementScrollable.style.overflowY = '';
    this.isFirstTime = false;

    this.startY = 9999999;
    this.moveY = 0;

    this.rotation = 0;
    this.spin = false;
    this.activated = false;
    this.pull = 0;
    this.pullFirst = 0;
  }
}
