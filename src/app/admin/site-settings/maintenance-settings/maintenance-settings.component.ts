import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-maintenance-settings',
  templateUrl: './maintenance-settings.component.html',
  styleUrls: ['./maintenance-settings.component.scss']
})
export class MaintenanceSettingsComponent implements OnInit {

  public maintenanceSettingForm: FormGroup
  public isValidationError: boolean
  public isConnectionError: boolean
  public isMaintenanceEnabled: any = false;
  public maintenanceMessage: any = "A murder of crows are performing maintenance on the website. We will be back up shortly. We appreciate your patience!";

  constructor(private fb: FormBuilder, private router: Router, public adminService: AdminService) {
    this.maintenanceSettingForm = this.fb.group({
      isEnabled: [null, Validators.required],
      message: [null, Validators.required]
    })
  }

  async ngOnInit() {
    await this.getMaintenanceMode()
  }

  public async getMaintenanceMode() {
    try {
      const maintenance = await this.adminService.getMaintenanceMode()
      this.isMaintenanceEnabled = maintenance.isEnabled
      this.maintenanceMessage = maintenance.message
    } catch (e) {
      this.isConnectionError = true
    }
  }

  public async setMaintenanceMode() {
    const maintenance = await this.adminService.getMaintenanceMode()
    if (this.maintenanceSettingForm.valid) {
      const { isEnabled, message } = this.maintenanceSettingForm.value
      this.isValidationError = false
      this.isConnectionError = false
      try {
        var createUpdateType = !maintenance ? 0 : 1
        await this.adminService.setMaintenanceMode({ createUpdateType, isEnabled, message })
      } catch (e) {
        this.isConnectionError = true
      }
    } else {
      this.isValidationError = true
    }
  }
}
