import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PullToRefreshComponent} from './pull-to-refresh.component';


@NgModule({
    declarations: [
        PullToRefreshComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        PullToRefreshComponent
    ]
})
export class PullToRefreshModule {

    public static forRoot(environment: any): ModuleWithProviders<PullToRefreshModule> {
        return {
            ngModule: PullToRefreshModule
        }
    }
}
