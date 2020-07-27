import { FeatureFlagDirective } from './feature-flag.directive';
import { TemplateRef, ViewContainerRef } from '@angular/core';

describe('FeatureFlagDirective', () => {
  it('should create an instance', () => {
    var templateRef: TemplateRef<any>
    var viewContainer: ViewContainerRef
    const directive = new FeatureFlagDirective(templateRef, viewContainer);
    expect(directive).toBeTruthy();
  });
});
