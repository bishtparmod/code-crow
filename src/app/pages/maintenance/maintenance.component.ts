import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  public maintenanceMessage: string

  constructor(private adminService: AdminService) { }

  async ngOnInit() {
    const maintenance = await this.adminService.getMaintenanceMode()
    if (maintenance.message) {
      this.maintenanceMessage = maintenance.message
    } else {
      this.maintenanceMessage = "Something went wrong. Please try again later!"
    }
  }
}
