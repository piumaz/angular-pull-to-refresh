/* tslint:disable:no-trailing-whitespace */
import {Component, OnInit, EventEmitter, Output, Input, ElementRef, HostListener, ViewChild, OnDestroy} from '@angular/core';
import {PullToRefreshService} from './pull-to-refresh.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'pull-to-refresh',
  templateUrl: './pull-to-refresh.component.html',
  styleUrls: ['./pull-to-refresh.component.scss']
})
export class PullToRefreshComponent implements OnInit, OnDestroy {

  @Input() color: string = '#353535';
  @Input() target: string = 'body';
  @Input() disabled: boolean = false;
  @Input() autoDismiss: boolean = true;

  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();


  resetSub: Subscription;

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

    this.elementScrollable = document.querySelector(this.target);

    window.addEventListener('touchstart', this.onTouchStart.bind(this), {passive: true});
    window.addEventListener('touchmove', this.onToucMove.bind(this), {passive: true});
    window.addEventListener('touchend', this.onTouchEnd.bind(this), {passive: true});
    window.addEventListener('touchcancel', this.onTouchEnd.bind(this), {passive: true});

    if ( !this.autoDismiss ) {
      this.resetSub = this.refreshService.reset$().subscribe(() => {
        this.dismiss();
      });
    }
  }

  ngOnDestroy() {
    this.resetSub.unsubscribe();
  }

  getScrollTop() {

    if (this.target === 'body') {
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
    this.startX = $e.touches[0].pageX;

  }

  onToucMove($e) {

    if (this.disabled) {
      return;
    }

    this.moveY = $e.touches[0].pageY;
    this.moveX = $e.touches[0].pageX;


    if (this.getScrollTop() > 0) {
      this.isFirstTime = true;
    }

    const shiftY = (this.moveY - this.startY);
    const shiftX = (this.moveX - this.startX);
    const ratio = Math.abs(shiftX)/Math.abs(shiftY);

    if (this.getScrollTop() === 0 && this.moveY >= this.startY && ratio <= 0.3) {

      setTimeout(() => {
        this.elementScrollable.style.overflowY = 'hidden';
      });


      if (this.isFirstTime) {

        this.pullFirst = shiftY >= this.maxFirstPull ? this.maxFirstPull : shiftY;

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

        const pullShiftY = shiftY / 2;

        this.pull = (pullShiftY >= this.maxPull) ? this.maxPull : pullShiftY + ((this.maxPull - pullShiftY) * 0.5);

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

      document.dispatchEvent(new Event('pull-to-refresh'));
      this.refreshService.pull();
      this.refresh.emit();

      if ( this.autoDismiss ) {
        this.dismiss();
      }


    } else {
      this.reset();
    }

  }

  dismiss() {
    setTimeout(() => {
      this.reset();
    }, 1500);
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
