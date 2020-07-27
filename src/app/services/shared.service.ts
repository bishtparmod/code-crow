import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class SharedService {
    private isScrollToTiers = false

    constructor() {

    }

    getIsScrollToTiers() {
        return this.isScrollToTiers
    }

    setIsScrollToTiers(val: boolean) {
        this.isScrollToTiers = val
    }
}