import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  HostListener,
  OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, Inject
} from '@angular/core';
import {PullToRefreshService} from './pull-to-refresh.service';
import {Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'pull-to-refresh',
  templateUrl: './pull-to-refresh.component.html',
  styleUrls: ['./pull-to-refresh.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PullToRefreshComponent implements OnInit, OnDestroy {

  /**
   * Spostamento in pixel che attiva il refresh
   */
  @Input('sensitivity') pullToRefresh: number = 90;

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


  radiusLeft = 0;
  radiusRight = 0;

  isFirstTime = true;

  private window: Window;

  constructor(
      private refreshService: PullToRefreshService,
      private changeDetectorRef: ChangeDetectorRef,
      @Inject(DOCUMENT) readonly document
  ) {
    this.window = this.document.defaultView;
  }

  ngOnInit() {
    this.elementScrollable = this.document.querySelector(this.target);

    if ( !this.autoDismiss ) {
      this.resetSub = this.refreshService.reset$().subscribe(() => {
        this.dismiss();
      });
    }
  }

  ngOnDestroy() {
    if (this.resetSub) {
      this.resetSub.unsubscribe();
    }
  }

  getScrollTop() {

    if (this.target === 'body') {
      return this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    }

    return this.elementScrollable.scrollTop;

  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart($e) {

    if (this.disabled || this.activated) {
      return;
    }

    this.reset();

    this.startY = $e.touches[0].pageY;
    this.startX = $e.touches[0].pageX;

  }

  @HostListener('window:touchmove', ['$event'])
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

  @HostListener('window:touchend', ['$event'])
  @HostListener('window:touchcancel', ['$event'])
  onTouchEnd($e) {
    if (this.disabled) {
      return;
    }

    if ( this.activated ) {
      this.spin = true;
      this.pull = this.animateY;

      this.document.dispatchEvent(new Event('pull-to-refresh'));
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

    this.changeDetectorRef.detectChanges();
  }
}
