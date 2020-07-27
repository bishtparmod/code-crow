import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
// import { CONFIG } from '../../environments/environment';

@Directive({
    selector: '[featureFlag]'
})
export class FeatureFlagDirective implements OnInit {
    @Input() featureFlag: string;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {}

    ngOnInit() {
        if (this.isEnabled()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

    isEnabled() {
        // const { features } = CONFIG;
        // //NOTE: another way to enable all features, replace default.json file with { "features": { "*": true } }
        // if (features['*']) { 
        //     return true;
        // }

        return true
    }
}